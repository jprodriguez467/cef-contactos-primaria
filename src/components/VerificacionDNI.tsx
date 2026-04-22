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
    if (!alumno.dni) {
      onVerificado();
      return;
    }
    if (dni.trim() === alumno.dni.trim()) {
      setError("");
      onVerificado();
    } else {
      setError("DNI incorrecto, no podés acceder a estos datos.");
    }
  }

  const inputStyle = {
    background: "#1e3a6e",
    border: "1px solid #3b5a9a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "14px",
    width: "100%",
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
      <h2 style={{ color: "#ffffff", fontWeight: 600, fontSize: "16px", marginBottom: "4px" }}>Verificación de identidad</h2>
      <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "16px" }}>
        Para acceder a los datos de <strong style={{ color: "#ffffff" }}>{alumno.nombreCompleto}</strong>, ingresá el DNI del alumno/a.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#cbd5e1", marginBottom: "4px" }}>DNI del alumno/a</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => { setDni(e.target.value); setError(""); }}
            placeholder="Ej: 12345678"
            style={inputStyle}
            required
            autoFocus
          />
        </div>
        {error && (
          <p style={{ color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "8px 12px", fontSize: "14px" }}>
            {error}
          </p>
        )}
        <div style={{ display: "flex", gap: "12px" }}>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition">
            Verificar
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}