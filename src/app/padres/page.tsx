"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BuscadorAlumno } from "@/components/BuscadorAlumno";
import { FichaAlumno } from "@/components/FichaAlumno";
import { VerificacionDNI } from "@/components/VerificacionDNI";
import type { Alumno } from "@/types";

export default function PadresPage() {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [verificado, setVerificado] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster />
      <div className="max-w-xl mx-auto">
        {!alumnoSeleccionado && (
          <BuscadorAlumno onSeleccionar={setAlumnoSeleccionado} />
        )}
        {alumnoSeleccionado && !verificado && (
          <VerificacionDNI
            alumno={alumnoSeleccionado}
            onVerificado={() => setVerificado(true)}
            onVolver={() => setAlumnoSeleccionado(null)}
          />
        )}
        {alumnoSeleccionado && verificado && (
          <FichaAlumno
            alumno={alumnoSeleccionado}
            onVolver={() => { setAlumnoSeleccionado(null); setVerificado(false); }}
          />
        )}
      </div>
    </main>
  );
}