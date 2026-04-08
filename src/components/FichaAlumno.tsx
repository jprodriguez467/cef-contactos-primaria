"use client";

import Image from "next/image";
import type { Alumno } from "@/types";

interface FichaAlumnoProps {
  alumno: Alumno;
  onSeleccionar?: () => void;
}

function Avatar({ fotoUrl, nombre }: { fotoUrl?: string; nombre: string }) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        alt={nombre}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover border border-white/20"
      />
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
      <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

export function FichaAlumno({ alumno, onSeleccionar }: FichaAlumnoProps) {
  const turnoLabel = alumno.turno === "manana" ? "Mañana" : "Tarde";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
      <div className="flex items-start gap-4">
        <Avatar fotoUrl={alumno.fotoUrl} nombre={alumno.nombreCompleto} />
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
