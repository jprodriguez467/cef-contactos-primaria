"use client";

import type { Alumno } from "@/types";

interface FichaAlumnoProps {
  alumno: Alumno;
  onSeleccionar?: () => void;
}

export function FichaAlumno({ alumno, onSeleccionar }: FichaAlumnoProps) {
  const turnoLabel = alumno.turno === "manana" ? "Mañana" : "Tarde";

  return (
    <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="28" height="28" fill="rgba(255,255,255,0.3)" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "#ffffff", fontWeight: 600, fontSize: "18px", marginBottom: "4px" }}>
            {alumno.nombreCompleto}
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            {alumno.grado} — {turnoLabel}
          </p>
        </div>
      </div>

      {onSeleccionar && (
        <button
          type="button"
          onClick={onSeleccionar}
          style={{ marginTop: "16px", color: "#93c5fd", fontSize: "14px", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
        >
          Ver / cargar datos de contacto
        </button>
      )}
    </div>
  );
}