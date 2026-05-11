"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getCuotasMes,
  registrarPago,
  type Cuota,
  type FormaPago,
} from "@/lib/firestore-cuotas";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";
import type { Alumno } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { GRADOS, TURNOS, type Grado, type Turno } from "@/types";

const CUOTA_BASE = 35000;
const CUOTA_CON_DESCUENTO = 30000; // para familias con 2+ hijos

interface Props {
  alumnos: Alumno[];
}

export function PanelCuotas({ alumnos }: Props) {
  const { user } = useAuth();

  // Mes seleccionado — por defecto el actual
  const [mes, setMes] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [cuotas, setCuotas] = useState<Record<string, Cuota>>({});
  const [loading, setLoading] = useState(false);

  // Modal de pago
  const [modalAlumno, setModalAlumno] = useState<Alumno | null>(null);
  const [montoPagado, setMontoPagado] = useState("");
  const [formaPago, setFormaPago] = useState<FormaPago>("efectivo");
  const [nota, setNota] = useState("");
  const [savingPago, setSavingPago] = useState(false);

  // Filtros
  const [gradoFiltro, setGradoFiltro] = useState<Grado | "">("");
  const [turnoFiltro, setTurnoFiltro] = useState<Turno | "">("");
  const [estadoFiltro, setEstadoFiltro] = useState<"" | "pagado" | "parcial" | "debe">("");

  async function cargarCuotas() {
    setLoading(true);
    try {
      const data = await getCuotasMes(mes);
      setCuotas(data);
    } catch {
      toast.error("Error al cargar cuotas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCuotas();
  }, [mes]);

  // Calcula monto según si tiene hermanos en la escuela
  function getMontoAcordado(alumno: Alumno): number {
    if (!alumno.telefono1) return CUOTA_BASE;
    const hermanos = alumnos.filter((a) => a.telefono1 === alumno.telefono1).length;
    return hermanos >= 2 ? CUOTA_CON_DESCUENTO : CUOTA_BASE;
  }

  function getCantHermanos(alumno: Alumno): number {
    if (!alumno.telefono1) return 1;
    return alumnos.filter((a) => a.telefono1 === alumno.telefono1).length;
  }

  // Estadísticas del mes
  const stats = useMemo(() => {
    const pagados = alumnos.filter((a) => cuotas[a.id!]?.estado === "pagado").length;
    const parciales = alumnos.filter((a) => cuotas[a.id!]?.estado === "parcial").length;
    const deben = alumnos.length - pagados - parciales;
    const recaudado = Object.values(cuotas).reduce((acc, c) => acc + (c.montoPagado || 0), 0);
    return { pagados, parciales, deben, recaudado };
  }, [alumnos, cuotas]);

  // Lista filtrada
  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) => {
      if (gradoFiltro && a.grado !== gradoFiltro) return false;
      if (turnoFiltro && a.turno !== turnoFiltro) return false;
      if (estadoFiltro) {
        const estado = cuotas[a.id!]?.estado || "debe";
        if (estado !== estadoFiltro) return false;
      }
      return true;
    });
  }, [alumnos, gradoFiltro, turnoFiltro, estadoFiltro, cuotas]);

  // Nombre del mes en español
  const mesLabel = new Date(mes + "-15").toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  });

  // Abre el modal
  function abrirModal(alumno: Alumno) {
    const cuota = cuotas[alumno.id!];
    setModalAlumno(alumno);
    setMontoPagado(cuota?.montoPagado?.toString() || "");
    setFormaPago(cuota?.formaPago || "efectivo");
    setNota(cuota?.nota || "");
  }

  async function handleRegistrarPago() {
    if (!modalAlumno || !montoPagado) return;
    if (formaPago === "efectivo" && !nota.trim()) {
      toast.error("Para pagos en efectivo escribí una nota");
      return;
    }
    setSavingPago(true);
    try {
      const montoAcordado = getMontoAcordado(modalAlumno);
      await registrarPago(modalAlumno.id!, mes, {
        montoBase: CUOTA_BASE,
        montoAcordado,
        montoPagado: Number(montoPagado),
        formaPago,
        registradoPor: user?.email || "admin",
        nota: nota.trim(),
      });
      await cargarCuotas();
      toast.success("✅ Pago registrado");
      setModalAlumno(null);
      setMontoPagado("");
      setNota("");
      setFormaPago("efectivo");
    } catch {
      toast.error("Error al registrar pago");
    } finally {
      setSavingPago(false);
    }
  }

  return (
    <div>
      {/* Encabezado */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Panel de Cuotas</h2>
          <p className="text-sm text-gray-500 capitalize">{mesLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Mes:</label>
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-2xl font-bold text-green-600">{stats.pagados}</p>
          <p className="text-xs text-gray-500 mt-1">Pagaron ✅</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-yellow-500">{stats.parciales}</p>
          <p className="text-xs text-gray-500 mt-1">Pago parcial ⚠️</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-red-500">{stats.deben}</p>
          <p className="text-xs text-gray-500 mt-1">Deben ❌</p>
        </Card>
        <Card>
          <p className="text-2xl font-bold text-blue-600">
            ${stats.recaudado.toLocaleString("es-AR")}
          </p>
          <p className="text-xs text-gray-500 mt-1">Recaudado</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Grado</label>
            <select
              value={gradoFiltro}
              onChange={(e) => setGradoFiltro(e.target.value as Grado | "")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {GRADOS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Turno</label>
            <select
              value={turnoFiltro}
              onChange={(e) => setTurnoFiltro(e.target.value as Turno | "")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              {TURNOS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as "" | "pagado" | "parcial" | "debe")}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Todos</option>
              <option value="pagado">✅ Pagaron</option>
              <option value="parcial">⚠️ Parcial</option>
              <option value="debe">❌ Deben</option>
            </select>
          </div>
          <p className="text-sm text-gray-400 ml-auto self-center">
            {alumnosFiltrados.length} alumnos
          </p>
        </div>
      </Card>

      {/* Tabla */}
      <Card>
        {loading ? (
          <p className="text-gray-400 text-center py-10">Cargando cuotas...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Alumno</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Grado</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Monto</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Estado</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Pagado</th>
                  <th className="text-left py-3 px-3 text-gray-600 font-medium">Forma</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.map((alumno) => {
                  const cuota = cuotas[alumno.id!];
                  const estado = cuota?.estado || "debe";
                  const montoAcordado = getMontoAcordado(alumno);
                  const hermanos = getCantHermanos(alumno);

                  return (
                    <tr key={alumno.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <p className="font-medium text-gray-800">
                          {alumno.nombreCompleto}
                        </p>
                        {hermanos >= 2 && (
                          <span className="text-xs text-purple-600">
                            👨‍👩‍👧 {hermanos} hijos en la escuela
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                        {alumno.grado} —{" "}
                        {alumno.turno === "manana" ? "Mañana" : "Tarde"}
                      </td>
                      <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                        ${montoAcordado.toLocaleString("es-AR")}
                        {hermanos >= 2 && (
                          <span className="block text-xs text-green-600">con descuento</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {estado === "pagado" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            ✅ Pagó
                          </span>
                        )}
                        {estado === "parcial" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                            ⚠️ Parcial
                          </span>
                        )}
                        {estado === "debe" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            ❌ Debe
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                        {cuota?.montoPagado
                          ? `$${cuota.montoPagado.toLocaleString("es-AR")}`
                          : "—"}
                        {estado === "parcial" && cuota && (
                          <span className="block text-xs text-red-500">
                            Falta: $
                            {(montoAcordado - cuota.montoPagado).toLocaleString("es-AR")}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">
                        {cuota?.formaPago === "efectivo"
                          ? "💵 Efectivo"
                          : cuota?.formaPago === "mercadopago"
                          ? "💳 MP"
                          : "—"}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => abrirModal(alumno)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium whitespace-nowrap"
                        >
                          {estado === "debe" ? "💰 Registrar" : "✏️ Editar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal registrar pago */}
      {modalAlumno && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Registrar pago</h3>
            <p className="text-sm text-gray-500 mb-5">
               {modalAlumno.nombreCompleto}—{" "}
              <span className="capitalize">{mesLabel}</span>
            </p>

            <div className="space-y-4">
              {/* Monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto pagado
                </label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(e.target.value)}
                  placeholder={`Cuota: $${getMontoAcordado(modalAlumno).toLocaleString("es-AR")}`}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                {montoPagado &&
                  Number(montoPagado) > 0 &&
                  Number(montoPagado) < getMontoAcordado(modalAlumno) && (
                    <p className="text-xs text-yellow-600 mt-1">
                      ⚠️ Pago incompleto — falta $
                      {(
                        getMontoAcordado(modalAlumno) - Number(montoPagado)
                      ).toLocaleString("es-AR")}
                    </p>
                  )}
                {montoPagado && Number(montoPagado) >= getMontoAcordado(modalAlumno) && (
                  <p className="text-xs text-green-600 mt-1">✅ Cuota completa</p>
                )}
              </div>

              {/* Forma de pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de pago
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormaPago("efectivo")}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formaPago === "efectivo"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    💵 Efectivo
                  </button>
                  <button
                    onClick={() => setFormaPago("mercadopago")}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formaPago === "mercadopago"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    💳 MercadoPago
                  </button>
                </div>
              </div>

              {/* Nota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nota{" "}
                  {formaPago === "efectivo" && (
                    <span className="text-red-500">* obligatorio</span>
                  )}
                </label>
                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder={
                    formaPago === "efectivo"
                      ? "Ej: Pagó en mano el lunes 12/05"
                      : "Opcional — número de transacción, etc."
                  }
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleRegistrarPago}
                loading={savingPago}
                disabled={
                  !montoPagado ||
                  Number(montoPagado) <= 0 ||
                  (formaPago === "efectivo" && !nota.trim())
                }
                className="flex-1"
              >
                Confirmar pago
              </Button>
              <Button
                variant="secondary"
                onClick={() => setModalAlumno(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
