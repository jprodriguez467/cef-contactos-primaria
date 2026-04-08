"use client";

import { useState, useCallback } from "react";
import { buscarAlumnos, getAllAlumnos, getAlumnosPorGradoTurno } from "@/lib/firestore";
import type { Alumno } from "@/types";

export function useBuscarAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (grado: string, turno: string, apellido: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await buscarAlumnos(grado, turno, apellido);
      setAlumnos(results);
    } catch {
      setError("Error al buscar alumnos");
    } finally {
      setLoading(false);
    }
  }, []);

  return { alumnos, loading, error, buscar };
}

export function useAllAlumnos() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await getAllAlumnos();
      setAlumnos(results);
    } catch {
      setError("Error al cargar alumnos");
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarPorFiltro = useCallback(async (grado: string, turno: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await getAlumnosPorGradoTurno(grado, turno);
      setAlumnos(results);
    } catch {
      setError("Error al cargar alumnos");
    } finally {
      setLoading(false);
    }
  }, []);

  return { alumnos, loading, error, cargar, cargarPorFiltro, setAlumnos };
}
