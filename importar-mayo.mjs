// importar-mayo.mjs v2 — ejecutar: node importar-mayo.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf-8").split("\n")
    .filter(l => l.includes("=") && !l.startsWith("#"))
    .map(l => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
);

const app = initializeApp({
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const PAGOS = [
  { nombre: "ABREGU VIRGINIA",           turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "ANDREOTTI LAUREANO",         turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "ARECO FUSE JOSEFINA",        turno: "manana", monto: 25000, forma: "efectivo"    },
  { nombre: "BARCALA SOFIA AYLEN",        turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "CESPEDES LOLA LUDMILA",      turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "LOPEZ XIOMARA",              turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "OPORTO HUGO",                turno: "manana", monto: 27000, forma: "efectivo"    },
  { nombre: "PARRA MALATINE VICTORIA",    turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "SALVADORE SALEME LUCIANO",   turno: "manana", monto: 25000, forma: "mercadopago" },
  { nombre: "ZANUTIGH SACCAVINO ANDRE",   turno: "manana", monto: 27000, forma: "mercadopago" },
  { nombre: "GUDINO CIELO",               turno: "manana", monto: 35000, forma: "efectivo"    },
  { nombre: "CESPEDES PALOMA",            turno: "manana", monto: 30000, forma: "mercadopago" },
  { nombre: "GONZALEZ DANGELO SIMON",     turno: "manana", monto: 35000, forma: "efectivo"    },
  { nombre: "BONALDI MALENA VICTORIA",    turno: "manana", monto: 35000, forma: "mercadopago" },
  { nombre: "ROMERO ANSES MARIA PAZ",     turno: "manana", monto: 35000, forma: "efectivo"    },
  { nombre: "BRITOS NABILA AGUSTINA",     turno: "manana", monto: 35000, forma: "mercadopago" },
  { nombre: "NORI LUCCA JESUS",           turno: "tarde",  monto: 35000, forma: "mercadopago" },
  { nombre: "AQUINO ZAMIRA LUCIANA",      turno: "tarde",  monto: 27000, forma: "efectivo"    },
  { nombre: "GIOVANNIELLO NICOLE YAMILA", turno: "tarde",  monto: 30000, forma: "efectivo"    },
  { nombre: "REYES GIANFRANCO",           turno: "tarde",  monto: 27000, forma: "mercadopago" },
  { nombre: "SALVADORES SALEME LUCIANO",  turno: "tarde",  monto: 25000, forma: "mercadopago" },
  { nombre: "SANTA CRUZ ALMA LOURDES",    turno: "tarde",  monto: 30000, forma: "mercadopago" },
];

function limpiar(s) {
  return s.toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function score(a, b) {
  const wa = limpiar(a).split(" ");
  const wb = limpiar(b).split(" ");
  const ok = wa.filter(w => wb.some(x => x.includes(w) || w.includes(x)));
  return ok.length / Math.max(wa.length, wb.length);
}

async function main() {
  console.log("🔥 Leyendo alumnos...");
  const snap = await getDocs(collection(db, "alumnos"));
  const alumnos = snap.docs.map(d => ({
    id: d.id,
    nombreCompleto: d.data().nombreCompleto || "",
    turno: d.data().turno || ""
  }));
  console.log(`✅ ${alumnos.length} alumnos\n`);

  const MES = "2026-05";
  let ok = 0, noEncontrados = [];

  for (const pago of PAGOS) {
    let mejor = null, mejorScore = 0;
    for (const a of alumnos) {
      if (a.turno !== pago.turno) continue;
      const s = score(pago.nombre, a.nombreCompleto);
      if (s > mejorScore) { mejorScore = s; mejor = a; }
    }

    if (mejor && mejorScore >= 0.4) {
      const estado = pago.monto >= 35000 ? "pagado" : "parcial";
      await setDoc(doc(db, "cuotas", MES, "alumnos", mejor.id), {
        alumnoId: mejor.id, mes: MES,
        montoBase: 35000, montoAcordado: pago.monto, montoPagado: pago.monto,
        formaPago: pago.forma, estado,
        registradoPor: "importacion-excel",
        nota: "Importado del Excel ciclo 2026",
        fechaPago: serverTimestamp(),
      });
      console.log(`✅ ${mejor.nombreCompleto} — $${pago.monto} (${pago.forma}) [${Math.round(mejorScore*100)}%]`);
      ok++;
    } else {
      console.log(`⚠️  NO encontrado: "${pago.nombre}" (mejor: "${mejor?.nombreCompleto}" [${Math.round(mejorScore*100)}%])`);
      noEncontrados.push(pago.nombre);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Importados: ${ok}`);
  console.log(`⚠️  Sin match: ${noEncontrados.length}`);
  noEncontrados.forEach(n => console.log(`   • ${n}`));
  process.exit(0);
}

main().catch(e => { console.error("❌ Error:", e.message); process.exit(1); });
