"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { eliminarTodosAlumnos, importarAlumnos } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import type { Alumno } from "@/types";

export function SubirExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [replaceAll, setReplaceAll] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
      });

      const alumnos: Omit<Alumno, "id">[] = rows
        .filter((row) => row["nombre"] && row["grado"] && row["turno"])
        .map((row) => ({
          nombreCompleto: String(row["nombre"]).toUpperCase(),
          grado: String(row["grado"]) as Alumno["grado"],
          turno: String(row["turno"]) === "tarde" ? "tarde" : "manana",
          ...(row["dni"] ? { dni: String(row["dni"]) } : {}),
          ...(row["fechaNacimiento"] ? { fechaNacimiento: String(row["fechaNacimiento"]) } : {}),
          ...(row["sexo"] ? { sexo: String(row["sexo"]) } : {}),
        }));

      if (alumnos.length === 0) {
        toast.error("No se encontraron alumnos válidos en el archivo");
        return;
      }

      if (replaceAll) {
        await eliminarTodosAlumnos();
      }

      const count = await importarAlumnos(alumnos);
      toast.success(`${count} alumnos importados`);
      setFile(null);
    } catch {
      toast.error("Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">
        Subí un archivo CSV o Excel con columnas:{" "}
        <code className="bg-gray-100 px-1 rounded">nombre</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">grado</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">turno</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">dni</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">fechaNacimiento</code>,{" "}
        <code className="bg-gray-100 px-1 rounded">sexo</code>
      </p>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={replaceAll}
          onChange={(e) => setReplaceAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        Reemplazar todos los alumnos existentes
      </label>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-sm"
      />
      <Button onClick={handleUpload} loading={loading} disabled={!file}>
        Importar alumnos
      </Button>
    </div>
  );
}
