"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { importarAlumnos } from "@/lib/firestore";
import { toast } from "react-hot-toast";
import { GRADOS, TURNOS, type Grado, type Turno } from "@/types";
import type { Alumno } from "@/types";

interface ModalAgregarAlumnoProps {
  onAgregado: (alumno: Alumno) => void;
  onCerrar: () => void;
}

const FORM_INICIAL = {
  nombreCompleto: "",
  grado: "" as Grado | "",
  turno: "" as Turno | "",
  dni: "",
  fechaNacimiento: "",
  sexo: "",
};

export function ModalAgregarAlumno({ onAgregado, onCerrar }: ModalAgregarAlumnoProps) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.grado || !form.turno) {
      toast.error("Seleccioná grado y turno");
      return;
    }
    setLoading(true);
    try {
      const nuevo = {
        nombreCompleto: form.nombreCompleto.toUpperCase(),
        grado: form.grado,
        turno: form.turno,
        ...(form.dni ? { dni: form.dni } : {}),
        ...(form.fechaNacimiento ? { fechaNacimiento: form.fechaNacimiento } : {}),
        ...(form.sexo ? { sexo: form.sexo } : {}),
      };
      await importarAlumnos([nuevo]);
      toast.success("Alumno agregado");
      // Para reflejar en la tabla necesitamos el id — recargamos la lista desde el padre
      onAgregado({ id: "", ...nuevo });
    } catch {
      toast.error("Error al agregar alumno");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">Agregar alumno</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              name="nombreCompleto"
              value={form.nombreCompleto}
              onChange={handleChange}
              placeholder="Apellido Nombre"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Grado</label>
            <select
              name="grado"
              value={form.grado}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Seleccioná</option>
              {GRADOS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Turno</label>
            <select
              name="turno"
              value={form.turno}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Seleccioná</option>
              {TURNOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>DNI</label>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej: 12345678"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              placeholder="Ej: 15/03/2015"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Sexo</label>
            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Seleccioná</option>
              <option value="M">M</option>
              <option value="F">F</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              Guardar
            </Button>
            <Button type="button" variant="secondary" onClick={onCerrar}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
