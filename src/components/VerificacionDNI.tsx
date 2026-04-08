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
      // Sin DNI cargado, se deja pasar
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

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
      <h2 className="text-base font-semibold text-white mb-1">Verificación de identidad</h2>
      <p className="text-sm text-white/60 mb-4">
        Para acceder a los datos de{" "}
        <span className="text-white font-medium">{alumno.nombreCompleto}</span>, ingresá el DNI del alumno/a.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            DNI del alumno/a
          </label>
          <input
            type="text"
            value={dni}
            onChange={(e) => { setDni(e.target.value); setError(""); }}
            placeholder="Ej: 12345678"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            required
            autoFocus
          />
        </div>
        {error && (
          <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-3">
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
