"use client";

import type { Alumno } from "@/types";
import { AvatarSeguro } from "./AvatarSeguro";

interface FichaAlumnoProps {
  alumno: Alumno;
  onSeleccionar?: () => void;
}

export function FichaAlumno({ alumno, onSeleccionar }: FichaAlumnoProps) {
  const turnoLabel = alumno.turno === "manana" ? "Mañana" : "Tarde";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
      <div className="flex items-start gap-4">
        <AvatarSeguro fotoUrl={alumno.fotoUrl} nombre={alumno.nombreCompleto} />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-white mb-1">
            {alumno.nombreCompleto}
          </h2>
          <p className="text-sm text-white/60">
            {alumno.grado} — {turnoLabel}
          </p>
        </div>
      </div>

      {onSeleccionar && (
        <button
          type="button"
          onClick={onSeleccionar}
          className="mt-4 text-sm text-blue-300 hover:text-blue-100 hover:underline transition"
        >
          Ver / cargar datos de contacto
        </button>
      )}
    </div>
  );
}
