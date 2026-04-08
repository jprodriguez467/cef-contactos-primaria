"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Alumno } from "@/types";

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
        {alumno.fotoUrl ? (
          <Image
            src={alumno.fotoUrl}
            alt={alumno.nombreCompleto}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-white/20 flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        )}
        <div>
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
