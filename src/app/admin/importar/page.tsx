"use client";
import { useState } from "react";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getApp } from "@/lib/firebase";
import { getAllAlumnos } from "@/lib/firestore";

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

function limpiar(s: string) {
  return s.toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function score(a: string, b: string) {
  const wa = limpiar(a).split(" ").filter(Boolean);
  const wb = limpiar(b).split(" ").filter(Boolean);
  if (!wa.length || !wb.length) return 0;
  const ok = wa.filter(w => wb.some(x => x.includes(w) || w.includes(x)));
  return ok.length / Math.max(wa.length, wb.length);
}

export default function ImportarMayo() {
  const [log, setLog] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const agregar = (msg: string) => setLog(prev => [...prev, msg]);

  async function debug() {
    setLog([]);
    const alumnos = await getAllAlumnos();
    agregar(`Total: ${alumnos.length}`);
    alumnos.slice(0, 5).forEach(a => {
      agregar(`nombre="${a.nombreCompleto}" turno="${a.turno}"`);
    });
  }

  async function importar() {
    setLoading(true);
    setLog([]);
    agregar("🔥 Cargando alumnos...");
    const alumnos = await getAllAlumnos();
    agregar(`✅ ${alumnos.length} alumnos\n`);

    const db = getFirestore(getApp());
    const MES = "2026-05";
    let ok = 0;

    for (const pago of PAGOS) {
      let mejor: typeof alumnos[0] | null = null;
      let mejorScore = 0;
      for (const a of alumnos) {
        if (a.turno !== pago.turno) continue;
        const s = score(pago.nombre, a.nombreCompleto || "");
        if (s > mejorScore) { mejorScore = s; mejor = a; }
      }

      if (mejor && mejorScore >= 0.4) {
        const estado = pago.monto >= 35000 ? "pagado" : "parcial";
        await setDoc(doc(db, "cuotas", MES, "alumnos", mejor.id!), {
          alumnoId: mejor.id, mes: MES,
          montoBase: 35000, montoAcordado: pago.monto, montoPagado: pago.monto,
          formaPago: pago.forma, estado,
          registradoPor: "importacion-excel",
          nota: "Importado del Excel ciclo 2026",
          fechaPago: serverTimestamp(),
        });
        agregar(`✅ ${mejor.nombreCompleto} — $${pago.monto} [${Math.round(mejorScore*100)}%]`);
        ok++;
      } else {
        agregar(`⚠️  NO: "${pago.nombre}" → mejor: "${mejor?.nombreCompleto}" [${Math.round(mejorScore*100)}%]`);
      }
    }
    agregar(`\n✅ Importados: ${ok}/${PAGOS.length}`);
    setLoading(false);
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Importar pagos Mayo 2026</h1>
        <div className="flex gap-3 mb-6">
          <button onClick={debug} className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
            🔍 Ver primeros alumnos
          </button>
          {!done && (
            <button onClick={importar} disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {loading ? "Importando..." : "🚀 Importar pagos"}
            </button>
          )}
        </div>
        {log.length > 0 && (
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap">
            {log.join("\n")}
          </div>
        )}
        {done && (
          <a href="/admin/dashboard" className="mt-4 block text-blue-400 underline">
            → Ir al Panel de Cuotas
          </a>
        )}
      </div>
    </main>
  );
}
