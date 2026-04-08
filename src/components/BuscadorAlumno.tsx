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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Grado</label>
        <select
          value={grado}
          onChange={(e) => setGrado(e.target.value as Grado)}
          className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          required
        >
          <option value="" className="text-gray-800">Seleccioná el grado</option>
          {GRADOS.map((g) => (
            <option key={g} value={g} className="text-gray-800">
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Turno</label>
        <select
          value={turno}
          onChange={(e) => setTurno(e.target.value as Turno)}
          className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          required
        >
          <option value="" className="text-gray-800">Seleccioná el turno</option>
          {TURNOS.map((t) => (
            <option key={t.value} value={t.value} className="text-gray-800">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">
          Apellido del alumno
        </label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          placeholder="Ingresá el apellido"
          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
          required
        />
      </div>

      <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow transition">
        Buscar
      </Button>
    </form>
  );
}
