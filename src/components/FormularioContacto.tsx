import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { actualizarContacto } from "@/lib/firestore";
import { toast } from "react-hot-toast";
import type { Alumno } from "@/types";

interface FormularioContactoProps {
  alumno: Alumno;
  onGuardado: (actualizado: Alumno) => void;
  onCancelar: () => void;
}

export function FormularioContacto({
  alumno,
  onGuardado,
  onCancelar,
}: FormularioContactoProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombreContacto1: alumno.nombreContacto1 ?? "",
    relacionContacto1: alumno.relacionContacto1 ?? "",
    telefono1: alumno.telefono1 ?? "",
    nombreContacto2: alumno.nombreContacto2 ?? "",
    relacionContacto2: alumno.relacionContacto2 ?? "",
    telefono2: alumno.telefono2 ?? "",
    nombreContacto3: alumno.nombreContacto3 ?? "",
    telefono3: alumno.telefono3 ?? "",
    nombreContacto4: alumno.nombreContacto4 ?? "",
    telefono4: alumno.telefono4 ?? "",
    nombreContacto5: alumno.nombreContacto5 ?? "",
    telefono5: alumno.telefono5 ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombreContacto1 || !form.telefono1) {
      toast.error("Completá al menos el contacto 1");
      return;
    }
    setLoading(true);
    try {
      await actualizarContacto(alumno.id, form);
      toast.success("Datos guardados");
      onGuardado({ ...alumno, ...form });
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "bg-white/10 border-white/20 text-white placeholder-white/30 focus:ring-white/30";
  const labelClass = "text-sm font-medium text-white/80";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm font-semibold text-white">{alumno.nombreCompleto}</p>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 1 *</legend>
        <div className="flex flex-col gap-3">
          <Input label="Nombre" name="nombreContacto1" value={form.nombreContacto1} onChange={handleChange} required className={inputClass} labelClassName={labelClass} />
          <Input label="Relación" name="relacionContacto1" value={form.relacionContacto1} onChange={handleChange} placeholder="Mamá, Papá, Tutor..." className={inputClass} labelClassName={labelClass} />
          <Input label="Teléfono" name="telefono1" value={form.telefono1} onChange={handleChange} required className={inputClass} labelClassName={labelClass} />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 2 (opcional)</legend>
        <div className="flex flex-col gap-3">
          <Input label="Nombre" name="nombreContacto2" value={form.nombreContacto2} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
          <Input label="Relación" name="relacionContacto2" value={form.relacionContacto2} onChange={handleChange} placeholder="Mamá, Papá, Tutor..." className={inputClass} labelClassName={labelClass} />
          <Input label="Teléfono" name="telefono2" value={form.telefono2} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 3 (opcional)</legend>
        <div className="flex flex-col gap-3">
          <Input label="Nombre" name="nombreContacto3" value={form.nombreContacto3} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
          <Input label="Teléfono" name="telefono3" value={form.telefono3} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 4 (opcional)</legend>
        <div className="flex flex-col gap-3">
          <Input label="Nombre" name="nombreContacto4" value={form.nombreContacto4} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
          <Input label="Teléfono" name="telefono4" value={form.telefono4} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 5 (opcional)</legend>
        <div className="flex flex-col gap-3">
          <Input label="Nombre" name="nombreContacto5" value={form.nombreContacto5} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
          <Input label="Teléfono" name="telefono5" value={form.telefono5} onChange={handleChange} className={inputClass} labelClassName={labelClass} />
        </div>
      </fieldset>

      <div className="flex gap-3">
        <Button type="submit" loading={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition">
          Guardar
        </Button>
        <Button type="button" variant="secondary" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}