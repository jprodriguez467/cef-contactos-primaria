"use client";

/**
 * PANEL ADMIN — FRASES POR GRADO
 *
 * Pantalla para que el administrador configure la frase secreta
 * de cada grado+turno y vea el progreso del juego.
 *
 * Ruta: /admin/frases
 *
 * Esta página es 100% aislada del resto del admin. Si algo falla,
 * solo afecta esta ruta.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { GRADOS, TURNOS } from "@/types";
import type { Grado, Turno } from "@/types";
import {
  obtenerFrase,
  guardarFrase,
  contarAlumnos,
} from "@/lib/frase-grado";

interface FilaGrado {
  grado: Grado;
  turno: Turno;
  turnoLabel: string;
  frase: string;
  activa: boolean;
  totalAlumnos: number;
  alumnosCompletados: number;
  cargando: boolean;
  guardando: boolean;
}

export default function AdminFrasesPage() {
  const [filas, setFilas] = useState<FilaGrado[]>([]);
  const [cargandoInicial, setCargandoInicial] = useState(true);

  // Cargar todas las filas al entrar
  useEffect(() => {
    async function cargar() {
      const filasIniciales: FilaGrado[] = [];
      for (const grado of GRADOS) {
        for (const turnoObj of TURNOS) {
          filasIniciales.push({
            grado,
            turno: turnoObj.value,
            turnoLabel: turnoObj.label,
            frase: "",
            activa: false,
            totalAlumnos: 0,
            alumnosCompletados: 0,
            cargando: true,
            guardando: false,
          });
        }
      }
      setFilas(filasIniciales);
      setCargandoInicial(false);

      // Cargar datos reales de cada fila en paralelo
      const promesas = filasIniciales.map(async (fila, idx) => {
        const [fraseData, conteo] = await Promise.all([
          obtenerFrase(fila.grado, fila.turno),
          contarAlumnos(fila.grado, fila.turno),
        ]);
        return {
          idx,
          datos: {
            frase: fraseData?.frase ?? "",
            activa: fraseData?.activa ?? false,
            totalAlumnos: conteo.total,
            alumnosCompletados: conteo.completados,
            cargando: false,
          },
        };
      });

      for (const p of promesas) {
        const resultado = await p;
        setFilas((prev) => {
          const nueva = [...prev];
          nueva[resultado.idx] = { ...nueva[resultado.idx], ...resultado.datos };
          return nueva;
        });
      }
    }
    cargar();
  }, []);

  function actualizarFila(idx: number, cambios: Partial<FilaGrado>) {
    setFilas((prev) => {
      const nueva = [...prev];
      nueva[idx] = { ...nueva[idx], ...cambios };
      return nueva;
    });
  }

  async function handleGuardar(idx: number) {
    const fila = filas[idx];
    if (!fila.frase.trim()) {
      toast.error("La frase no puede estar vacía");
      return;
    }
    actualizarFila(idx, { guardando: true });
    const ok = await guardarFrase(fila.grado, fila.turno, fila.frase, fila.activa);
    actualizarFila(idx, { guardando: false });
    if (ok) {
      toast.success(`Frase guardada para ${fila.grado} (${fila.turnoLabel})`);
    } else {
      toast.error("Error al guardar. Intentá de nuevo.");
    }
  }

  function contarPalabras(frase: string): number {
    return frase.trim().split(/\s+/).filter((p) => p.length > 0).length;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4 transition"
        >
          ← Volver al dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">
          Frases del juego por grado
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Configurá la frase secreta de cada grado. A medida que los padres
          completan el teléfono de contacto, se van revelando las palabras.
        </p>

        {cargandoInicial && (
          <p className="text-white/60 text-center py-8">Cargando...</p>
        )}

        {!cargandoInicial && (
          <div className="flex flex-col gap-3">
            {filas.map((fila, idx) => {
              const palabras = contarPalabras(fila.frase);
              const porcentaje =
                fila.totalAlumnos > 0
                  ? Math.round((fila.alumnosCompletados / fila.totalAlumnos) * 100)
                  : 0;
              return (
                <div
                  key={`${fila.grado}-${fila.turno}`}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {fila.grado}{" "}
                        <span className="text-white/60 font-normal">
                          ({fila.turnoLabel})
                        </span>
                      </h2>
                      {fila.cargando ? (
                        <p className="text-xs text-white/40">Cargando datos...</p>
                      ) : (
                        <p className="text-xs text-white/60">
                          {fila.alumnosCompletados} de {fila.totalAlumnos} alumnos
                          con contacto cargado
                          {fila.totalAlumnos > 0 && ` · ${porcentaje}%`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-white/80 select-none cursor-pointer">
                        <input
                          type="checkbox"
                          checked={fila.activa}
                          onChange={(e) =>
                            actualizarFila(idx, { activa: e.target.checked })
                          }
                          className="accent-blue-500"
                        />
                        Activa
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <input
                      type="text"
                      value={fila.frase}
                      onChange={(e) => actualizarFila(idx, { frase: e.target.value })}
                      placeholder="Escribí la frase secreta de este grado..."
                      className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                    <button
                      onClick={() => handleGuardar(idx)}
                      disabled={fila.guardando || fila.cargando}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg shadow transition whitespace-nowrap"
                    >
                      {fila.guardando ? "Guardando..." : "Guardar"}
                    </button>
                  </div>

                  {fila.frase && (
                    <p className="text-xs text-white/40 mt-2">
                      {palabras} {palabras === 1 ? "palabra" : "palabras"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}