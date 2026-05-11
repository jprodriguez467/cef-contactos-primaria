import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getApp } from "./firebase";   // ← esta línea tiene que estar

function db() {
  return getFirestore(getApp());
}

export type EstadoCuota = "pagado" | "parcial" | "debe";
export type FormaPago = "efectivo" | "mercadopago";

export interface Cuota {
  alumnoId: string;
  mes: string; // "2025-05"
  estado: EstadoCuota;
  montoBase: number;
  montoAcordado: number;
  montoPagado: number;
  formaPago?: FormaPago;
  registradoPor?: string;
  nota?: string;
}

export async function getCuotasMes(mes: string): Promise<Record<string, Cuota>> {
  const colRef = collection(db(), "cuotas", mes, "alumnos");
  const snap = await getDocs(colRef);
  const result: Record<string, Cuota> = {};
  snap.forEach((d) => {
    result[d.id] = { alumnoId: d.id, ...d.data() } as Cuota;
  });
  return result;
}

export async function registrarPago(
  alumnoId: string,
  mes: string,
  data: {
    montoBase: number;
    montoAcordado: number;
    montoPagado: number;
    formaPago: FormaPago;
    registradoPor: string;
    nota?: string;
  }
) {
  const estado: EstadoCuota =
    data.montoPagado >= data.montoAcordado
      ? "pagado"
      : data.montoPagado > 0
      ? "parcial"
      : "debe";

  // Guarda el pago
  const ref = doc(db(), "cuotas", mes, "alumnos", alumnoId);
  await setDoc(ref, { ...data, estado, mes, fechaPago: serverTimestamp() }, { merge: true });

 // Registro de auditoría — queda grabado para siempre
  await addDoc(collection(db(), "auditoria"), {
    accion: "registrar_pago",
    alumnoId,
    mes,
    ...data,
    estado,
    timestamp: serverTimestamp(),
  });
}
