/**
 * LÓGICA FIRESTORE DEL MÓDULO FRASE-GRADO
 *
 * Todas las funciones están envueltas en try/catch: si Firestore falla
 * o la colección "frases_grado" aún no existe, las funciones devuelven
 * valores seguros (null, array vacío) en lugar de romper la app.
 *
 * Este módulo NO modifica datos de la colección "alumnos" existente.
 * Solo lee de ahí para contar progreso.
 */

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { getApp } from "./firebase";
import { GRADOS, TURNOS } from "@/types";
import type { Grado, Turno } from "@/types";
import type {
  FraseGrado,
  EstadoFrase,
  EstadoFraseOpcional,
  EntradaRanking,
} from "@/types/frase-grado";

function db() {
  return getFirestore(getApp());
}

/**
 * Genera el ID del documento de una frase.
 * Normaliza espacios y caracteres especiales para que sea un ID válido.
 * Ejemplo: ("3° grado", "manana") -> "3_grado_manana"
 */
export function fraseDocId(grado: Grado, turno: Turno): string {
  const gradoNormalizado = grado
    .toLowerCase()
    .replace(/°/g, "")
    .replace(/\s+/g, "_")
    .trim();
  return `${gradoNormalizado}_${turno}`;
}

/**
 * Parte una frase en un array de palabras, respetando espacios múltiples.
 */
export function partirFrase(frase: string): string[] {
  return frase.trim().split(/\s+/).filter((p) => p.length > 0);
}

/**
 * Lee la frase configurada para un grado+turno.
 * Devuelve null si no existe o si hay error.
 */
export async function obtenerFrase(
  grado: Grado,
  turno: Turno
): Promise<FraseGrado | null> {
  try {
    const ref = doc(db(), "frases_grado", fraseDocId(grado, turno));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      grado: data.grado as Grado,
      turno: data.turno as Turno,
      frase: String(data.frase ?? ""),
      activa: Boolean(data.activa),
      ultimaActualizacion: Number(data.ultimaActualizacion ?? 0),
    };
  } catch (error) {
    console.warn("[frase-grado] Error leyendo frase", error);
    return null;
  }
}

/**
 * Guarda o actualiza la frase de un grado+turno.
 * Solo se usa desde el panel admin.
 */
export async function guardarFrase(
  grado: Grado,
  turno: Turno,
  frase: string,
  activa: boolean = true
): Promise<boolean> {
  try {
    const ref = doc(db(), "frases_grado", fraseDocId(grado, turno));
    await setDoc(ref, {
      grado,
      turno,
      frase: frase.trim(),
      activa,
      ultimaActualizacion: Timestamp.now().toMillis(),
    });
    return true;
  } catch (error) {
    console.error("[frase-grado] Error guardando frase", error);
    return false;
  }
}

/**
 * Cuenta cuántos alumnos hay en un grado+turno y cuántos tienen
 * telefono1 cargado (criterio de "completado").
 */
export async function contarAlumnos(
  grado: Grado,
  turno: Turno
): Promise<{ total: number; completados: number }> {
  try {
    const q = query(
      collection(db(), "alumnos"),
      where("grado", "==", grado),
      where("turno", "==", turno)
    );
    const snap = await getDocs(q);
    let completados = 0;
    snap.forEach((d) => {
      const tel = d.data().telefono1;
      if (tel && String(tel).trim().length > 0) completados++;
    });
    return { total: snap.size, completados };
  } catch (error) {
    console.warn("[frase-grado] Error contando alumnos", error);
    return { total: 0, completados: 0 };
  }
}

/**
 * Calcula el estado completo de la frase para un grado+turno.
 * Combina frase configurada + conteo de alumnos + cálculo de progreso.
 * Devuelve null si no hay frase configurada o si hay error.
 */
export async function calcularEstadoFrase(
  grado: Grado,
  turno: Turno
): Promise<EstadoFraseOpcional> {
  const fraseConfig = await obtenerFrase(grado, turno);
  if (!fraseConfig || !fraseConfig.activa) return null;

  const { total, completados } = await contarAlumnos(grado, turno);
  const palabras = partirFrase(fraseConfig.frase);
  const totalPalabras = palabras.length;

  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  let palabrasReveladas = Math.round((porcentaje / 100) * totalPalabras);
  if (completados > 0 && palabrasReveladas === 0) palabrasReveladas = 1;
  if (palabrasReveladas > totalPalabras) palabrasReveladas = totalPalabras;

  return {
    grado,
    turno,
    frase: fraseConfig.frase,
    palabras,
    totalPalabras,
    palabrasReveladas,
    totalAlumnos: total,
    alumnosCompletados: completados,
    porcentaje,
    activa: fraseConfig.activa,
  };
}

/**
 * Arma el ranking completo de todos los grados+turnos.
 * Ordena por porcentaje de completado (descendente).
 * Solo incluye grados que tienen alumnos cargados.
 */
export async function obtenerRanking(): Promise<EntradaRanking[]> {
  const entradas: EntradaRanking[] = [];

  for (const grado of GRADOS) {
    for (const turnoObj of TURNOS) {
      const turno = turnoObj.value;
      try {
        const { total, completados } = await contarAlumnos(grado, turno);
        if (total === 0) continue;

        const fraseConfig = await obtenerFrase(grado, turno);
        const tieneFrase = !!(fraseConfig && fraseConfig.activa);
        const porcentaje = Math.round((completados / total) * 100);

        entradas.push({
          grado,
          turno,
          etiqueta: `${grado} (${turnoObj.label})`,
          porcentaje,
          alumnosCompletados: completados,
          totalAlumnos: total,
          tieneFrase,
        });
      } catch (error) {
        console.warn(`[frase-grado] Error en ${grado} ${turno}`, error);
      }
    }
  }

  entradas.sort((a, b) => {
    if (b.porcentaje !== a.porcentaje) return b.porcentaje - a.porcentaje;
    return a.grado.localeCompare(b.grado);
  });

  return entradas;
}