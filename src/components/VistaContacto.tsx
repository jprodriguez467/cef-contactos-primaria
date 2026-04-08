"use client";

import { Button } from "@/components/ui/Button";
import type { Alumno } from "@/types";
import { AvatarSeguro } from "./AvatarSeguro";

interface VistaContactoProps {
  alumno: Alumno;
  onEditar: () => void;
  onVolver: () => void;
}

export function VistaContacto({ alumno, onEditar, onVolver }: VistaContactoProps) {
  const turnoLabel = alumno.turno === "manana" ? "Mañana" : "Tarde";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg flex flex-col gap-5">

      {/* Encabezado alumno */}
      <div className="flex items-center gap-4">
        <AvatarSeguro fotoUrl={alumno.fotoUrl} nombre={alumno.nombreCompleto} />
          <h2 className="text-lg font-semibold text-white">{alumno.nombreCompleto}</h2>
          <p className="text-sm text-white/60">{alumno.grado} — {turnoLabel}</p>
        </div>
      </div>

      {/* Contacto 1 */}
      <div className="border-t border-white/20 pt-4 space-y-1">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Contacto 1</p>
        <Row label="Nombre" value={alumno.nombreContacto1} />
        <Row label="Relación" value={alumno.relacionContacto1} />
        <Row label="Teléfono" value={alumno.telefono1} />
      </div>

      {/* Contacto 2 */}
      {(alumno.nombreContacto2 || alumno.telefono2) && (
        <div className="border-t border-white/20 pt-4 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Contacto 2</p>
          <Row label="Nombre" value={alumno.nombreContacto2} />
          <Row label="Relación" value={alumno.relacionContacto2} />
          <Row label="Teléfono" value={alumno.telefono2} />
        </div>
      )}

      {/* Contacto 3 */}
      {(alumno.nombreContacto3 || alumno.telefono3) && (
        <div className="border-t border-white/20 pt-4 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Contacto 3</p>
          <Row label="Nombre" value={alumno.nombreContacto3} />
          <Row label="Teléfono" value={alumno.telefono3} />
        </div>
      )}

      {/* Contacto 4 */}
      {(alumno.nombreContacto4 || alumno.telefono4) && (
        <div className="border-t border-white/20 pt-4 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Contacto 4</p>
          <Row label="Nombre" value={alumno.nombreContacto4} />
          <Row label="Teléfono" value={alumno.telefono4} />
        </div>
      )}

      {/* Contacto 5 */}
      {(alumno.nombreContacto5 || alumno.telefono5) && (
        <div className="border-t border-white/20 pt-4 space-y-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">Contacto 5</p>
          <Row label="Nombre" value={alumno.nombreContacto5} />
          <Row label="Teléfono" value={alumno.telefono5} />
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        <Button
          onClick={onEditar}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Editar datos de contacto
        </Button>
        <Button variant="secondary" onClick={onVolver}>
          Volver
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-white/50 w-24 flex-shrink-0">{label}:</span>
      <span className="text-white/90">{value ?? "—"}</span>
    </div>
  );
}
