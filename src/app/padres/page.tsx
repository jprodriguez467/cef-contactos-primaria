"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BuscadorAlumno } from "@/components/BuscadorAlumno";
import { FichaAlumno } from "@/components/FichaAlumno";
import { VerificacionDNI } from "@/components/VerificacionDNI";
import { FormularioContacto } from "@/components/FormularioContacto";
import { buscarAlumnos } from "@/lib/firestore";
import type { Alumno } from "@/types";

export default function PadresPage() {
  const [resultados, setResultados] = useState<Alumno[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    try { if (window.top) window.top.scrollTo(0, 0); } catch (e) {}
  }, [alumnoSeleccionado, verificado, mostrarFormulario, guardado]);

  function scrollTop() {
    try { if (window.top) window.top.scrollTo(0, 0); } catch (e) {}
    window.scrollTo(0, 0);
  }

  async function handleBuscar(grado: string, turno: string, apellido: string) {
    setLoading(true);
    const data = await buscarAlumnos(grado, turno, apellido);
    setResultados(data);
    setLoading(false);
  }

  if (alumnoSeleccionado && !verificado) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <VerificacionDNI
            alumno={alumnoSeleccionado}
            onVerificado={() => setVerificado(true)}
            onCancelar={() => { setAlumnoSeleccionado(null); scrollTop(); }}
          />
        </div>
      </main>
    );
  }
if (alumnoSeleccionado && verificado && guardado) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🗝️</div>
        <h2 className="text-2xl font-bold text-white mb-3">¡Gracias!</h2>
        <p className="text-white/70 mb-6">Ayudaste a desbloquear una palabra del mensaje secreto de tu grado.</p>
        <button
          onClick={() => { if(window.top) window.top.location.href = "https://cef-contactos-primaria.vercel.app/padres/juego"; else window.location.href = "https://cef-contactos-primaria.vercel.app/padres/juego"; }}
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 px-6 rounded-full shadow-lg transition"
        >
          Ver ranking del grado 🏆
        </button>
      </div>
    </main>
  );
}
  if (alumnoSeleccionado && verificado && mostrarFormulario) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <FormularioContacto
            alumno={alumnoSeleccionado}
            onGuardado={(actualizado) => { setAlumnoSeleccionado(actualizado); setMostrarFormulario(false); setGuardado(true); scrollTop(); }}
onCancelar={() => { setMostrarFormulario(false); scrollTop(); }}
          />
        </div>
      </main>
    );
  }

  if (alumnoSeleccionado && verificado) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
        <div className="max-w-xl mx-auto">
          <FichaAlumno
            alumno={alumnoSeleccionado}
            onSeleccionar={() => { setMostrarFormulario(true); scrollTop(); }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <Toaster />
      <div className="max-w-xl mx-auto">
        <BuscadorAlumno onBuscar={handleBuscar} loading={loading} />
        {resultados.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {resultados.map((a) => (
              <button
                key={a.id}
                onClick={() => { setAlumnoSeleccionado(a); scrollTop(); }}
                className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white transition"
              >
                {a.nombreCompleto} — {a.grado} ({a.turno === "manana" ? "Mañana" : "Tarde"})
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}