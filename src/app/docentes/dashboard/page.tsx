"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { getAlumnosPorGradoTurno } from "@/lib/firestore";
import { TablaAlumnos } from "@/components/TablaAlumnos";
import { Button } from "@/components/ui/Button";
import { GRADOS, TURNOS, type Grado, type Turno } from "@/types";
import { toast, Toaster } from "react-hot-toast";
import type { Alumno } from "@/types";
import MusicPlayer from '../../../components/MusicPlayer';

export default function DocentesDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [grado, setGrado] = useState<Grado | "">("");
  const [turno, setTurno] = useState<Turno | "">("");
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/docentes/login");
  }, [user, authLoading, router]);

  async function handleBuscar(e: React.FormEvent) {
    e.preventDefault();
    if (!grado || !turno) return;
    setLoading(true);
    try {
      const results = await getAlumnosPorGradoTurno(grado, turno);
      setAlumnos(results);
    } catch (err) {
      console.error("[Docentes Dashboard] Error al cargar alumnos:", err);
      toast.error("Error al cargar alumnos");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/docentes/login");
  }

  if (authLoading) return <div className="p-8 text-white">Cargando...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Panel Docentes</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Salir
          </Button>
        </div>

        <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg">
          <form onSubmit={handleBuscar} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Grado
              </label>
              <select
                value={grado}
                onChange={(e) => setGrado(e.target.value as Grado)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              >
                <option value="" className="text-gray-800">Seleccioná</option>
                {GRADOS.map((g) => (
                  <option key={g} value={g} className="text-gray-800">
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Turno
              </label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as Turno)}
                className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              >
                <option value="" className="text-gray-800">Seleccioná</option>
                {TURNOS.map((t) => (
                  <option key={t.value} value={t.value} className="text-gray-800">
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" loading={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition">
              Ver alumnos
            </Button>
          </form>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg overflow-x-auto">
          <TablaAlumnos alumnos={alumnos} loading={loading} />
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full text-center py-6 mt-4">
        <p className="text-white/30 text-xs italic">
          © 2025 Rodriguez Juan Pablo — Todos los derechos reservados
        </p>
      </footer>
      <MusicPlayer src="/lolivac-dance-with-me-today-304614.mp3" />
    </main>
  );
}
