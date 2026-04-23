"use client";

import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BuscadorAlumno } from "@/components/BuscadorAlumno";
import { FichaAlumno } from "@/components/FichaAlumno";
import { VerificacionDNI } from "@/components/VerificacionDNI";
import { FormularioContacto } from "@/components/FormularioContacto";
import { buscarAlumnos } from "@/lib/firestore";
import type { Alumno } from "@/types";

const bg: React.CSSProperties = { minHeight: "100vh", backgroundColor: "#0f172a", padding: "32px 16px" };
const card: React.CSSProperties = { backgroundColor: "#1e3a8a", borderRadius: "16px", padding: "24px", maxWidth: "580px", margin: "0 auto", boxShadow: "0 4px 24px #000" };

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
      <main style={bg}>
        <div style={card}>
          <VerificacionDNI alumno={alumnoSeleccionado} onVerificado={() => setVerificado(true)} onCancelar={() => { setAlumnoSeleccionado(null); scrollTop(); }} />
        </div>
      </main>
    );
  }

  if (alumnoSeleccionado && verificado && guardado) {
    return (
      <main style={bg}>
        <div style={{ ...card, textAlign: "center", paddingTop: "48px", paddingBottom: "48px" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🗝️</div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", marginBottom: "12px" }}>¡Gracias!</h2>
          <p style={{ color: "#93c5fd", marginBottom: "24px" }}>Ayudaste a desbloquear una palabra del mensaje secreto de tu grado.</p>
          <button onClick={() => { window.location.href = "https://cef-contactos-primaria.vercel.app/padres/juego"; }} style={{ backgroundColor: "#facc15", color: "#713f12", fontWeight: "bold", padding: "12px 24px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "16px" }}>
            Ver ranking del grado 🏆
          </button>
        </div>
      </main>
    );
  }

  if (alumnoSeleccionado && verificado && mostrarFormulario) {
    return (
      <main style={bg}>
        <div style={card}>
          <FormularioContacto alumno={alumnoSeleccionado} onGuardado={(actualizado) => { setAlumnoSeleccionado(actualizado); setMostrarFormulario(false); setGuardado(true); scrollTop(); }} onCancelar={() => { setMostrarFormulario(false); scrollTop(); }} />
        </div>
      </main>
    );
  }

  if (alumnoSeleccionado && verificado) {
    return (
      <main style={bg}>
        <div style={card}>
          <FichaAlumno alumno={alumnoSeleccionado} onSeleccionar={() => { setMostrarFormulario(true); scrollTop(); }} />
        </div>
      </main>
    );
  }

  return (
    <main style={bg}>
      <Toaster />
      <div style={{ maxWidth: "580px", margin: "0 auto" }}>
        <div style={card}>
          <BuscadorAlumno onBuscar={handleBuscar} loading={loading} />
        </div>
        {resultados.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            {resultados.map((a) => (
              <div key={a.id} style={{ marginBottom: "8px" }}>
                <button onClick={() => { setAlumnoSeleccionado(a); scrollTop(); }} style={{ width: "100%", textAlign: "left", backgroundColor: "#1e3a8a", border: "1px solid #3b82f6", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", cursor: "pointer", fontSize: "15px" }}>
                  {a.nombreCompleto} — {a.grado} ({a.turno === "manana" ? "Mañana" : "Tarde"})
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}