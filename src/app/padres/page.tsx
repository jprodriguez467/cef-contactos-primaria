"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BuscadorAlumno } from "@/components/BuscadorAlumno";
import { FichaAlumno } from "@/components/FichaAlumno";
import { VerificacionDNI } from "@/components/VerificacionDNI";
import { VistaContacto } from "@/components/VistaContacto";
import { FormularioContacto } from "@/components/FormularioContacto";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useBuscarAlumnos } from "@/hooks/useAlumnos";
import { buscarAlumnoPorDNI } from "@/lib/firestore";
import type { Alumno } from "@/types";
import MusicPlayer from '../../components/MusicPlayer';

type Paso = "lista" | "verificando" | "viendo" | "editando";
type Modo = "grado" | "dni";

export default function PadresPage() {
  const { alumnos, loading, error, buscar } = useBuscarAlumnos();
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [paso, setPaso] = useState<Paso>("lista");
  const [listadoLocal, setListadoLocal] = useState<Alumno[]>([]);

  const [modo, setModo] = useState<Modo>("grado");
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [loadingDNI, setLoadingDNI] = useState(false);
  const [errorDNI, setErrorDNI] = useState<string | null>(null);

  function handleCambiarModo(nuevoModo: Modo) {
    setModo(nuevoModo);
    setAlumnoSeleccionado(null);
    setPaso("lista");
    setListadoLocal([]);
    setErrorDNI(null);
    setDniBusqueda("");
  }

  function handleBuscar(grado: string, turno: string, apellido: string) {
    setAlumnoSeleccionado(null);
    setPaso("lista");
    setListadoLocal([]);
    buscar(grado, turno, apellido);
  }

  async function handleBuscarPorDNI(e: React.FormEvent) {
    e.preventDefault();
    if (!dniBusqueda.trim()) return;
    setLoadingDNI(true);
    setErrorDNI(null);
    setAlumnoSeleccionado(null);
    setPaso("lista");
    try {
      const alumno = await buscarAlumnoPorDNI(dniBusqueda);
      if (!alumno) {
        setErrorDNI("No se encontró ningún alumno con ese DNI.");
      } else {
        setAlumnoSeleccionado(alumno);
        // Saltear verificación DNI: el DNI ya fue usado para buscar
        if (alumno.telefono1 || alumno.nombreContacto1) {
          setPaso("viendo");
        } else {
          setPaso("editando");
        }
      }
    } catch {
      setErrorDNI("Error al buscar. Intentá de nuevo.");
    } finally {
      setLoadingDNI(false);
    }
  }

  function handleSeleccionar(a: Alumno) {
    setAlumnoSeleccionado(a);
    setPaso("verificando");
  }

  function handleVerificado() {
    if (!alumnoSeleccionado) return;
    if (alumnoSeleccionado.telefono1 || alumnoSeleccionado.nombreContacto1) {
      setPaso("viendo");
    } else {
      setPaso("editando");
    }
  }

  function handleGuardado(actualizado: Alumno) {
    setListadoLocal((prev) =>
      prev.length > 0
        ? prev.map((a) => (a.id === actualizado.id ? actualizado : a))
        : alumnos.map((a) => (a.id === actualizado.id ? actualizado : a))
    );
    setAlumnoSeleccionado(actualizado);
    setPaso("viendo");
  }

  function handleVolver() {
    setAlumnoSeleccionado(null);
    setPaso("lista");
  }

  const alumnosMostrar = listadoLocal.length > 0 ? listadoLocal : alumnos;

  const tabBase =
    "flex-1 py-2 px-4 text-sm font-medium rounded-lg transition";
  const tabActivo =
    "bg-white text-blue-900 shadow";
  const tabInactivo =
    "text-white/60 hover:text-white";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8 px-4">
      <Toaster />
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white mb-4 transition"
        >
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">
          Escuela San Francisco
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Buscá a tu hijo/a para cargar los datos de contacto.
        </p>

        {/* Tabs de modo de búsqueda */}
        <div className="mb-4 flex gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-1">
          <button
            className={`${tabBase} ${modo === "grado" ? tabActivo : tabInactivo}`}
            onClick={() => handleCambiarModo("grado")}
          >
            Buscar por grado y nombre
          </button>
          <button
            className={`${tabBase} ${modo === "dni" ? tabActivo : tabInactivo}`}
            onClick={() => handleCambiarModo("dni")}
          >
            Buscar por DNI
          </button>
        </div>

        {/* Buscador según modo */}
        {modo === "grado" && (
          <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
            <BuscadorAlumno onBuscar={handleBuscar} loading={loading} />
          </div>
        )}

        {modo === "dni" && (
          <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleBuscarPorDNI} className="flex flex-col gap-4">
              <div>
                <label htmlFor="dni-busqueda" className="block text-sm font-medium text-white/80 mb-1">
                  DNI del alumno/a
                </label>
                <input
                  id="dni-busqueda"
                  type="text"
                  inputMode="numeric"
                  value={dniBusqueda}
                  onChange={(e) => setDniBusqueda(e.target.value)}
                  placeholder="Ej: 12345678"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <Button
                type="submit"
                loading={loadingDNI}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
              >
                Buscar
              </Button>
            </form>
            {errorDNI && (
              <p className="mt-4 text-sm text-red-300">{errorDNI}</p>
            )}
          </div>
        )}

        {/* Errores de búsqueda por grado */}
        {modo === "grado" && error && (
          <p className="text-red-300 text-sm mb-4">{error}</p>
        )}

        {modo === "grado" && !loading && alumnos.length === 0 && !error && (
          <p className="text-sm text-white/40 text-center">
            Ingresá los datos para buscar.
          </p>
        )}

        {/* Lista de resultados (solo modo grado) */}
        {modo === "grado" && paso === "lista" && alumnosMostrar.length > 0 && (
          <div className="flex flex-col gap-4">
            {alumnosMostrar.map((a) => (
              <FichaAlumno
                key={a.id}
                alumno={a}
                onSeleccionar={() => handleSeleccionar(a)}
              />
            ))}
          </div>
        )}

        {/* Verificación DNI (solo modo grado) */}
        {paso === "verificando" && alumnoSeleccionado && (
          <VerificacionDNI
            alumno={alumnoSeleccionado}
            onVerificado={handleVerificado}
            onCancelar={handleVolver}
          />
        )}

        {/* Vista de datos ya cargados */}
        {paso === "viendo" && alumnoSeleccionado && (
          <VistaContacto
            alumno={alumnoSeleccionado}
            onEditar={() => setPaso("editando")}
            onVolver={handleVolver}
          />
        )}

        {/* Formulario de edición */}
        {paso === "editando" && alumnoSeleccionado && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
            <FormularioContacto
              alumno={alumnoSeleccionado}
              onGuardado={handleGuardado}
              onCancelar={() =>
                alumnoSeleccionado.telefono1 || alumnoSeleccionado.nombreContacto1
                  ? setPaso("viendo")
                  : handleVolver()
              }
            />
          </div>
        )}
      </div>

      <footer className="max-w-xl mx-auto w-full text-center py-6 mt-4">
        <p className="text-white/30 text-xs italic">
          © 2025 Rodriguez Juan Pablo — Todos los derechos reservados
        </p>
      </footer>
      <MusicPlayer src="/nastelbom-background-music-443623.mp3" />
    </main>
  );
}
