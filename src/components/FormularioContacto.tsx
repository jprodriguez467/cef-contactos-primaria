"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { actualizarContacto } from "@/lib/firestore";
import { subirFotoAlumno } from "@/lib/storage";
import { toast } from "react-hot-toast";
import { Camera } from "lucide-react";
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
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(alumno.fotoUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setFoto(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombreContacto1 || !form.telefono1) {
      toast.error("Completá al menos el contacto 1");
      return;
    }
    setLoading(true);
    try {
      let fotoUrl = alumno.fotoUrl;
      if (foto) {
        fotoUrl = await subirFotoAlumno(alumno.id, foto);
      }
      const datos: Partial<typeof form & { fotoUrl?: string }> = { ...form, ...(fotoUrl ? { fotoUrl } : {}) };
      await actualizarContacto(alumno.id, datos);
      toast.success("Datos guardados");
      onGuardado({ ...alumno, ...datos });
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

      {/* Foto */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 border border-white/20 flex items-center justify-center">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Foto del alumno"
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          ) : (
            <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Foto del alumno"
          onChange={handleFotoChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="secondary"
          className="flex items-center gap-2 text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={15} />
          {previewUrl ? "Cambiar foto" : "Agregar foto"}
        </Button>
      </div>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">Contacto 1 *</legend>
        <div className="flex flex-col gap-3">
          <Input
            label="Nombre"
            name="nombreContacto1"
            value={form.nombreContacto1}
            onChange={handleChange}
            required
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Relación"
            name="relacionContacto1"
            value={form.relacionContacto1}
            onChange={handleChange}
            placeholder="Mamá, Papá, Tutor..."
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Teléfono"
            name="telefono1"
            value={form.telefono1}
            onChange={handleChange}
            required
            className={inputClass}
            labelClassName={labelClass}
          />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">
          Contacto 2 (opcional)
        </legend>
        <div className="flex flex-col gap-3">
          <Input
            label="Nombre"
            name="nombreContacto2"
            value={form.nombreContacto2}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Relación"
            name="relacionContacto2"
            value={form.relacionContacto2}
            onChange={handleChange}
            placeholder="Mamá, Papá, Tutor..."
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Teléfono"
            name="telefono2"
            value={form.telefono2}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">
          Contacto 3 (opcional)
        </legend>
        <div className="flex flex-col gap-3">
          <Input
            label="Nombre"
            name="nombreContacto3"
            value={form.nombreContacto3}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Teléfono"
            name="telefono3"
            value={form.telefono3}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">
          Contacto 4 (opcional)
        </legend>
        <div className="flex flex-col gap-3">
          <Input
            label="Nombre"
            name="nombreContacto4"
            value={form.nombreContacto4}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Teléfono"
            name="telefono4"
            value={form.telefono4}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
        </div>
      </fieldset>

      <fieldset className="border border-white/20 rounded-lg p-4">
        <legend className="text-xs font-semibold px-2 text-white/50">
          Contacto 5 (opcional)
        </legend>
        <div className="flex flex-col gap-3">
          <Input
            label="Nombre"
            name="nombreContacto5"
            value={form.nombreContacto5}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
          <Input
            label="Teléfono"
            name="telefono5"
            value={form.telefono5}
            onChange={handleChange}
            className={inputClass}
            labelClassName={labelClass}
          />
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
