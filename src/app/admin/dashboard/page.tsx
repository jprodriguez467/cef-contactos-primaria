"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { getAllAlumnos, eliminarAlumno, eliminarGradoCompleto, eliminarTodosAlumnos, limpiarContactos, limpiarContactosGrado, limpiarTodosContactos } from "@/lib/firestore";
import { SubirExcel } from "@/components/SubirExcel";
import { TablaAlumnos } from "@/components/TablaAlumnos";
import { ModalAgregarAlumno } from "@/components/ModalAgregarAlumno";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GRADOS, TURNOS, type Grado, type Turno } from "@/types";
import { toast, Toaster } from "react-hot-toast";
import type { Alumno } from "@/types";
import MusicPlayer from '../../../components/MusicPlayer';

export default function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [filtrados, setFiltrados] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [gradoFiltro, setGradoFiltro] = useState<Grado | "">("");
  const [turnoFiltro, setTurnoFiltro] = useState<Turno | "">("");

  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);

  // Estado para el panel "Eliminar grado completo"
  const [mostrarEliminarGrado, setMostrarEliminarGrado] = useState(false);
  const [gradoEliminar, setGradoEliminar] = useState<Grado | "">("");
  const [turnoEliminar, setTurnoEliminar] = useState<Turno | "">("");
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  // Estado para el panel "Limpiar contactos del grado"
  const [mostrarLimpiarGrado, setMostrarLimpiarGrado] = useState(false);
  const [gradoLimpiar, setGradoLimpiar] = useState<Grado | "">("");
  const [turnoLimpiar, setTurnoLimpiar] = useState<Turno | "">("");
  const [loadingLimpiar, setLoadingLimpiar] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push("/admin/login");
  }, [user, authLoading, isAdmin, router]);

  useEffect(() => {
    if (user && isAdmin) cargar();
  }, [user, isAdmin]);

  async function cargar() {
    setLoading(true);
    try {
      const data = await getAllAlumnos();
      setAlumnos(data);
      setFiltrados(data);
    } catch {
      toast.error("Error al cargar alumnos");
    } finally {
      setLoading(false);
    }
  }

  function aplicarFiltros(grado: string, turno: string, lista: Alumno[]) {
    let resultado = lista;
    if (grado) resultado = resultado.filter((a) => a.grado === grado);
    if (turno) resultado = resultado.filter((a) => a.turno === turno);
    setFiltrados(resultado);
  }

  async function handleEliminar(id: string) {
    if (!confirm("Â¿Eliminar este alumno?")) return;
    try {
      await eliminarAlumno(id);
      const nuevos = alumnos.filter((a) => a.id !== id);
      setAlumnos(nuevos);
      aplicarFiltros(gradoFiltro, turnoFiltro, nuevos);
      toast.success("Alumno eliminado");
    } catch {
      toast.error("Error al eliminar");
    }
  }

  async function handleLimpiar(id: string, nombre: string) {
    if (!confirm(`Â¿Borrar los datos de contacto de ${nombre}? El alumno NO se elimina del listado.`)) return;
    try {
      await limpiarContactos(id);
      const nuevos = alumnos.map((a) =>
        a.id === id
          ? {
              ...a,
              nombreContacto1: undefined, relacionContacto1: undefined, telefono1: undefined,
              nombreContacto2: undefined, relacionContacto2: undefined, telefono2: undefined,
              nombreContacto3: undefined, telefono3: undefined,
              nombreContacto4: undefined, telefono4: undefined,
              nombreContacto5: undefined, telefono5: undefined,
              fotoUrl: undefined,
            }
          : a
      );
      setAlumnos(nuevos);
      aplicarFiltros(gradoFiltro, turnoFiltro, nuevos);
      toast.success("Contactos eliminados");
    } catch {
      toast.error("Error al limpiar contactos");
    }
  }

  async function handleLimpiarGrado() {
    const limpiarTodos = gradoLimpiar === "";
    if (!limpiarTodos && !turnoLimpiar) {
      toast.error("Seleccioná grado y turno");
      return;
    }

    const cantidad = limpiarTodos
      ? alumnos.length
      : alumnos.filter((a) => a.grado === gradoLimpiar && a.turno === turnoLimpiar).length;

    if (cantidad === 0) {
      toast.error(limpiarTodos ? "No hay alumnos para limpiar" : "No hay alumnos en ese grado/turno");
      return;
    }

    const descripcion = limpiarTodos
      ? "todos los alumnos"
      : `${gradoLimpiar} — ${turnoLimpiar === "manana" ? "Mañana" : "Tarde"}`;

    const confirmado = confirm(
      `¿Limpiar los contactos de ${cantidad} alumno${cantidad !== 1 ? "s" : ""} de ${descripcion}?\n\nLos alumnos NO se eliminan del listado.`
    );
    if (!confirmado) return;

    setLoadingLimpiar(true);
    try {
      let limpiados: number;
      if (limpiarTodos) {
        limpiados = await limpiarTodosContactos();
      } else {
        limpiados = await limpiarContactosGrado(gradoLimpiar, turnoLimpiar);
      }

      const nuevos = alumnos.map((a) =>
        limpiarTodos || (a.grado === gradoLimpiar && a.turno === turnoLimpiar)
          ? {
              ...a,
              nombreContacto1: undefined, relacionContacto1: undefined, telefono1: undefined,
              nombreContacto2: undefined, relacionContacto2: undefined, telefono2: undefined,
              nombreContacto3: undefined, telefono3: undefined,
              nombreContacto4: undefined, telefono4: undefined,
              nombreContacto5: undefined, telefono5: undefined,
              fotoUrl: undefined,
            }
          : a
      );
      setAlumnos(nuevos);
      aplicarFiltros(gradoFiltro, turnoFiltro, nuevos);
      toast.success(`Contactos de ${limpiados} alumno${limpiados !== 1 ? "s" : ""} eliminados`);
      setMostrarLimpiarGrado(false);
      setGradoLimpiar("");
      setTurnoLimpiar("");
    } catch {
      toast.error("Error al limpiar contactos del grado");
    } finally {
      setLoadingLimpiar(false);
    }
  }

  async function handleEliminarGrado() {
    const eliminarTodos = gradoEliminar === "";
    if (!eliminarTodos && !turnoEliminar) {
      toast.error("Seleccioná grado y turno");
      return;
    }

    const cantidad = eliminarTodos
      ? alumnos.length
      : alumnos.filter((a) => a.grado === gradoEliminar && a.turno === turnoEliminar).length;

    if (cantidad === 0) {
      toast.error(eliminarTodos ? "No hay alumnos para eliminar" : "No hay alumnos en ese grado/turno");
      return;
    }

    const descripcion = eliminarTodos
      ? "todos los alumnos"
      : `${gradoEliminar} — ${turnoEliminar === "manana" ? "Mañana" : "Tarde"}`;

    const confirmado = confirm(
      `¿Estás seguro? Se eliminarán ${cantidad} alumno${cantidad !== 1 ? "s" : ""} de ${descripcion}.

Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    setLoadingEliminar(true);
    try {
      if (eliminarTodos) {
        await eliminarTodosAlumnos();
      } else {
        await eliminarGradoCompleto(gradoEliminar, turnoEliminar);
      }

      const nuevos = eliminarTodos
        ? []
        : alumnos.filter((a) => !(a.grado === gradoEliminar && a.turno === turnoEliminar));
      setAlumnos(nuevos);
      aplicarFiltros(gradoFiltro, turnoFiltro, nuevos);
      toast.success(`${cantidad} alumno${cantidad !== 1 ? "s" : ""} eliminado${cantidad !== 1 ? "s" : ""}`);
      setMostrarEliminarGrado(false);
      setGradoEliminar("");
      setTurnoEliminar("");
    } catch {
      toast.error("Error al eliminar el grado");
    } finally {
      setLoadingEliminar(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  if (authLoading) return <div className="p-8 text-gray-500">Cargando...</div>;
  if (!user || !isAdmin) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster />
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Panel Administrador</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Salir
          </Button>
        </div>

        {/* EstadÃ­sticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <p className="text-3xl font-bold text-blue-600">{alumnos.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total alumnos</p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-green-600">
              {alumnos.filter((a) => a.telefono1).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Con contacto cargado</p>
          </Card>
          <Card>
            <p className="text-3xl font-bold text-orange-500">
              {alumnos.filter((a) => !a.telefono1).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Sin contacto</p>
          </Card>
        </div>

        {/* Importar */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">Importar alumnos</h2>
          <SubirExcel />
          <Button variant="secondary" className="mt-3 text-xs" onClick={cargar}>
            Recargar lista
          </Button>
        </Card>

        {/* Tabla con filtros */}
        <Card>
          <div className="flex flex-wrap gap-4 mb-4 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label htmlFor="filtro-grado" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por grado
                </label>
                <select
                  id="filtro-grado"
                  value={gradoFiltro}
                  onChange={(e) => {
                    const g = e.target.value as Grado | "";
                    setGradoFiltro(g);
                    aplicarFiltros(g, turnoFiltro, alumnos);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {GRADOS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="filtro-turno" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por turno
                </label>
                <select
                  id="filtro-turno"
                  value={turnoFiltro}
                  onChange={(e) => {
                    const t = e.target.value as Turno | "";
                    setTurnoFiltro(t);
                    aplicarFiltros(gradoFiltro, t, alumnos);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {TURNOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones acciÃ³n */}
        <Button
  onClick={() => setMostrarModalAgregar(true)}
>
  + Agregar alumno
</Button>
<a href="/admin/frases">
  <Button variant="secondary">
    🗝️ Frases del juego
  </Button>
</a>
              <Button
                variant="secondary"
                onClick={() => { setMostrarLimpiarGrado((v) => !v); setMostrarEliminarGrado(false); }}
              >
                Limpiar contactos del grado
              </Button>
              <Button
                variant="danger"
                onClick={() => { setMostrarEliminarGrado((v) => !v); setMostrarLimpiarGrado(false); }}
              >
                Eliminar grado completo
              </Button>
            </div>
          </div>

          {/* Panel limpiar contactos del grado */}
          {mostrarLimpiarGrado && (
            <div className="mb-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex flex-wrap gap-4 items-end">
              <div>
                <label htmlFor="limpiar-grado" className="block text-sm font-medium text-yellow-800 mb-1">
                  Grado
                </label>
                <select
                  id="limpiar-grado"
                  value={gradoLimpiar}
                  onChange={(e) => setGradoLimpiar(e.target.value as Grado)}
                  className="border border-yellow-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {GRADOS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="limpiar-turno" className="block text-sm font-medium text-yellow-800 mb-1">
                  Turno
                </label>
                <select
                  id="limpiar-turno"
                  value={turnoLimpiar}
                  onChange={(e) => setTurnoLimpiar(e.target.value as Turno)}
                  className="border border-yellow-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {TURNOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {(gradoLimpiar || turnoLimpiar) && (
                <p className="text-sm text-yellow-700 self-center">
                  {gradoLimpiar === ""
                    ? alumnos.length
                    : alumnos.filter(
                        (a) => a.grado === gradoLimpiar && a.turno === turnoLimpiar
                      ).length}{" "}
                  alumno(s) â€” solo se borran los contactos
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  loading={loadingLimpiar}
                  onClick={handleLimpiarGrado}
                >
                  Confirmar limpieza
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarLimpiarGrado(false);
                    setGradoLimpiar("");
                    setTurnoLimpiar("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Panel eliminar grado completo */}
          {mostrarEliminarGrado && (
            <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg flex flex-wrap gap-4 items-end">
              <div>
                <label htmlFor="eliminar-grado" className="block text-sm font-medium text-red-700 mb-1">
                  Grado
                </label>
                <select
                  id="eliminar-grado"
                  value={gradoEliminar}
                  onChange={(e) => setGradoEliminar(e.target.value as Grado)}
                  className="border border-red-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {GRADOS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="eliminar-turno" className="block text-sm font-medium text-red-700 mb-1">
                  Turno
                </label>
                <select
                  id="eliminar-turno"
                  value={turnoEliminar}
                  onChange={(e) => setTurnoEliminar(e.target.value as Turno)}
                  className="border border-red-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {TURNOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              {gradoEliminar && turnoEliminar && (
                <p className="text-sm text-red-600 self-center">
                  {alumnos.filter(
                    (a) => a.grado === gradoEliminar && a.turno === turnoEliminar
                  ).length}{" "}
                  alumno(s) serÃ¡n eliminados
                </p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="danger"
                  loading={loadingEliminar}
                  onClick={handleEliminarGrado}
                >
                  Confirmar eliminaciÃ³n
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarEliminarGrado(false);
                    setGradoEliminar("");
                    setTurnoEliminar("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <TablaAlumnos alumnos={filtrados} onEliminar={handleEliminar} onLimpiar={handleLimpiar} loading={loading} />
        </Card>
      </div>

      {mostrarModalAgregar && (
        <ModalAgregarAlumno
          onAgregado={() => { setMostrarModalAgregar(false); cargar(); }}
          onCerrar={() => setMostrarModalAgregar(false)}
        />
      )}

      <footer className="max-w-5xl mx-auto w-full text-center py-6 mt-4">
        <p className="text-gray-400 text-xs italic">
          Â© 2025 Rodriguez Juan Pablo â€” Todos los derechos reservados
        </p>
      </footer>
      <MusicPlayer src="/joyinsound-upbeat-waves-of-sea-496465.mp3" />
    </main>
  );
}


