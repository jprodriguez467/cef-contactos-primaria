"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { GRADOS, TURNOS } from "@/types";
import type { Grado, Turno } from "@/types";
import { obtenerRanking } from "@/lib/frase-grado";
import type { EntradaRanking } from "@/types/frase-grado";

const MEDALLAS = ["🥇", "🥈", "🥉"];

export default function JuegoPage() {
  const [ranking, setRanking] = useState<EntradaRanking[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      const datos = await obtenerRanking();
      setRanking(datos);
      setCargando(false);
    }
    cargar();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <Toaster />
      <div className="max-w-xl mx-auto">
        <Link
          href="/padres"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4 transition"
        >
          ← Volver
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🗝️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Mensaje secreto del grado
          </h1>
          <p className="text-sm text-white/60">
            A medida que los papás cargan sus datos, se van revelando
            las palabras del mensaje secreto de cada grado.
          </p>
        </div>

        {cargando && (
          <p className="text-white/60 text-center py-8">Cargando ranking...</p>
        )}

        {!cargando && ranking.length === 0 && (
          <p className="text-white/40 text-center py-8">
            Todavía no hay frases configuradas. El admin debe cargarlas primero.
          </p>
        )}

        {!cargando && ranking.length > 0 && (
          <div className="flex flex-col gap-3">
            {ranking.map((entrada, idx) => (
              <div
                key={`${entrada.grado}-${entrada.turno}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {idx < 3 ? MEDALLAS[idx] : `${idx + 1}.`}
                    </span>
                    <span className="font-semibold text-white text-sm">
                      {entrada.etiqueta}
                    </span>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">
                    {entrada.porcentaje}%
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${entrada.porcentaje}%` }}
                  />
                </div>

                <p className="text-xs text-white/50">
                  {entrada.alumnosCompletados} de {entrada.totalAlumnos} familias completaron
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/padres"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 px-6 rounded-full shadow-lg transition"
          >
            Cargar mis datos y desbloquear palabras
          </Link>
        </div>
      </div>
    </main>
  );
}