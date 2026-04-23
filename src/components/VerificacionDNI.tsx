"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Alumno } from "@/types";

interface VerificacionDNIProps {
  alumno: Alumno;
  onVerificado: () => void;
  onCancelar: () => void;
}

export function VerificacionDNI({ alumno, onVerificado, onCancelar }: VerificacionDNIProps) {
  const [dni, setDni] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!alumno.dni) { onVerificado(); return; }
    if (dni.trim() === alumno.dni.trim()) {
      setError(""); onVerificado();
    } else {
      setError("DNI incorrecto, no podés acceder a estos datos.");
    }
  }

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", boxSizing: "border-box",
    background: "#1e3a6e", border: "2px solid #3b5a9a",
    color: "#ffffff", borderRadius: "8px", padding: "10px 14px", fontSize: "15px",
  };

  return (
    <div style={{ background: "#1e3a8a", border: "2px solid #3b82f6", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px #000" }}>
      <h2 style={{ color: "#ffffff", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>Verificación de identidad</h2>
      <p style={{ color: "#93c5fd", fontSize: "14px", marginBottom: "16px" }}>
        Para acceder a los datos de <strong style={{ color: "#ffffff" }}>{alumno.nombreCompleto}</strong>, ingresá el DNI del alumno/a.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#ffffff", marginBottom: "6px" }}>DNI del alumno/a</label>
          <input
            type="text" value={dni}
            onChange={(e) => { setDni(e.target.value); setError(""); }}
            placeholder="Ej: 12345678"
            style={inputStyle} required autoFocus
          />
        </div>
        {error && (
          <p style={{ color: "#fca5a5", background: "#7f1d1d", border: "1px solid #ef4444", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", marginBottom: "16px" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", marginTop: "8px" }}>
          <div style={{ marginRight: "12px" }}>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition">
              Verificar
            </Button>
          </div>
          <Button type="button" variant="secondary" onClick={onCancelar}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}