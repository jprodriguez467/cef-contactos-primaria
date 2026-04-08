"use client";

import Image from "next/image";
import type { Alumno } from "@/types";
import { Button } from "@/components/ui/Button";
import { Trash2, Eraser } from "lucide-react";

interface TablaAlumnosProps {
  alumnos: Alumno[];
  onEliminar?: (id: string) => void;
  onLimpiar?: (id: string, nombre: string) => void;
  loading?: boolean;
}

function FotoCell({ fotoUrl, nombre }: { fotoUrl?: string; nombre: string }) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        alt={nombre}
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover border border-gray-200"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    </div>
  );
}

export function TablaAlumnos({ alumnos, onEliminar, onLimpiar, loading }: TablaAlumnosProps) {
  if (loading) return <p className="text-sm text-gray-500">Cargando...</p>;
  if (alumnos.length === 0) return <p className="text-sm text-gray-500">No hay alumnos.</p>;

  const hayAcciones = !!(onEliminar || onLimpiar);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border-b">Foto</th>
            <th className="p-3 border-b">Nombre</th>
            <th className="p-3 border-b">Grado</th>
            <th className="p-3 border-b">Turno</th>
            <th className="p-3 border-b">DNI</th>
            <th className="p-3 border-b">Contacto 1</th>
            <th className="p-3 border-b">Tel 1</th>
            {hayAcciones && <th className="p-3 border-b">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50 border-b">
              <td className="p-3">
                <FotoCell fotoUrl={a.fotoUrl} nombre={a.nombreCompleto} />
              </td>
              <td className="p-3">{a.nombreCompleto}</td>
              <td className="p-3">{a.grado}</td>
              <td className="p-3">{a.turno === "manana" ? "Mañana" : "Tarde"}</td>
              <td className="p-3">{a.dni ?? "—"}</td>
              <td className="p-3">{a.nombreContacto1 ?? "—"}</td>
              <td className="p-3">{a.telefono1 ?? "—"}</td>
              {hayAcciones && (
                <td className="p-3">
                  <div className="flex gap-1">
                    {onLimpiar && (
                      <Button
                        variant="secondary"
                        className="!px-2 !py-1"
                        onClick={() => onLimpiar(a.id, a.nombreCompleto)}
                        title="Limpiar contactos"
                      >
                        <Eraser size={14} />
                      </Button>
                    )}
                    {onEliminar && (
                      <Button
                        variant="danger"
                        className="!px-2 !py-1"
                        onClick={() => onEliminar(a.id)}
                        title="Eliminar alumno"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
