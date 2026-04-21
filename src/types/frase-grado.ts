/**
 * MÓDULO FRASE-GRADO
 *
 * Sistema de gamificación para motivar la carga de datos de contacto.
 * Cada grado + turno tiene una frase secreta. A medida que los alumnos
 * tienen cargado su contacto principal (telefono1), se van revelando
 * palabras de la frase.
 *
 * Este módulo es 100% aislado: si algo falla, el sistema de contactos
 * sigue funcionando normalmente.
 */

import type { Grado, Turno } from "@/types";

/**
 * Una frase configurada para un grado+turno específico.
 * Se guarda en la colección Firestore "frases_grado".
 * El ID del documento es `${grado}_${turno}` normalizado.
 */
export interface FraseGrado {
  grado: Grado;
  turno: Turno;
  frase: string;
  activa: boolean;
  ultimaActualizacion: number;
}

/**
 * Estado calculado en tiempo real del progreso de un grado+turno.
 * NO se guarda en Firestore — se calcula leyendo la colección "alumnos".
 */
export interface EstadoFrase {
  grado: Grado;
  turno: Turno;
  frase: string;
  palabras: string[];
  totalPalabras: number;
  palabrasReveladas: number;
  totalAlumnos: number;
  alumnosCompletados: number;
  porcentaje: number;
  activa: boolean;
}

/**
 * Entrada del ranking — un grado con su progreso, para ordenar.
 */
export interface EntradaRanking {
  grado: Grado;
  turno: Turno;
  etiqueta: string;
  porcentaje: number;
  alumnosCompletados: number;
  totalAlumnos: number;
  tieneFrase: boolean;
}

export type EstadoFraseOpcional = EstadoFrase | null;