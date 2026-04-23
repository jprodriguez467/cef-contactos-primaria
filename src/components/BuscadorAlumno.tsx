"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GRADOS, TURNOS, type Grado, type Turno } from "@/types";

interface BuscadorAlumnoProps {
  onBuscar: (grado: string, turno: string, apellido: string) => void;
  loading?: boolean;
}

export function BuscadorAlumno({ onBuscar, loading }: BuscadorAlumnoProps) {
  const [grado, setGrado] = useState<Grado | "">("");
  const [turno, setTurno] = useState<Turno | "">("");
  const [apellido, setApellido] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!grado || !turno || !apellido.trim()) return;
    onBuscar(grado, turno, apellido.trim());
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#cbd5e1",
    marginBottom: "6px",
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    background: "#1e3a6e",
    border: "2px solid #3b5a9a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "15px",
    appearance: "auto",
    WebkitAppearance: "auto",
    MozAppearance: "auto",
  } as React.CSSProperties;

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Grado</label>
        <select
          value={grado}
          onChange={(e) => setGrado(e.target.value as Grado)}
          style={inputStyle}
          required
        >
          <option value="">Seleccioná el grado</option>
          {GRADOS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Turno</label>
        <select
          value={turno}
          onChange={(e) => setTurno(e.target.value as Turno)}
          style={inputStyle}
          required
        >
          <option value="">Seleccioná el turno</option>
          {TURNOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Apellido del alumno</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Ingresá el apellido"
          style={inputStyle}
          required
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition"
      >
        Buscar
      </Button>
    </form>
  );
}