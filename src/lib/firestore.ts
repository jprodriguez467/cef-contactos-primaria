import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  doc,
} from "firebase/firestore";
import { getApp } from "./firebase";
import type { Alumno } from "@/types";

function db() {
  return getFirestore(getApp());
}

export async function buscarAlumnos(
  grado: string,
  turno: string,
  apellido: string
): Promise<Alumno[]> {
  const q = query(
    collection(db(), "alumnos"),
    where("grado", "==", grado),
    where("turno", "==", turno)
  );
  const snap = await getDocs(q);
  const results: Alumno[] = [];
  snap.forEach((d) => {
    const data = d.data();
    const nombre = String(data["nombreCompleto"] ?? "").toUpperCase();
    if (nombre.includes(apellido.toUpperCase())) {
      results.push({ id: d.id, ...buildAlumno(data) });
    }
  });
  return results;
}

export async function getAlumnosPorGradoTurno(
  grado: string,
  turno: string
): Promise<Alumno[]> {
  const q = query(
    collection(db(), "alumnos"),
    where("grado", "==", grado),
    where("turno", "==", turno)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...buildAlumno(d.data()) }));
  results.sort((a, b) => a.nombreCompleto.localeCompare(b.nombreCompleto));
  return results;
}

export async function getAllAlumnos(): Promise<Alumno[]> {
  const snap = await getDocs(collection(db(), "alumnos"));
  return snap.docs.map((d) => ({ id: d.id, ...buildAlumno(d.data()) }));
}

export async function buscarAlumnoPorDNI(dni: string): Promise<Alumno | null> {
  const q = query(
    collection(db(), "alumnos"),
    where("dni", "==", dni.trim())
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...buildAlumno(d.data()) };
}

export async function actualizarContacto(
  id: string,
  datos: Partial<Alumno>
): Promise<void> {
  const ref = doc(db(), "alumnos", id);
  await updateDoc(ref, datos);
}

export async function importarAlumnos(
  alumnos: Omit<Alumno, "id">[]
): Promise<number> {
  let count = 0;
  for (const alumno of alumnos) {
    await addDoc(collection(db(), "alumnos"), alumno);
    count++;
  }
  return count;
}

export async function limpiarTodosContactos(): Promise<number> {
  const snap = await getDocs(collection(db(), "alumnos"));
  const updates = snap.docs.map((d) => updateDoc(doc(db(), "alumnos", d.id), CAMPOS_CONTACTO));
  await Promise.all(updates);
  return snap.size;
}

export async function eliminarTodosAlumnos(): Promise<number> {
  const snap = await getDocs(collection(db(), "alumnos"));
  const deletes = snap.docs.map((d) => deleteDoc(doc(db(), "alumnos", d.id)));
  await Promise.all(deletes);
  return snap.size;
}

export async function eliminarAlumno(id: string): Promise<void> {
  await deleteDoc(doc(db(), "alumnos", id));
}

const CAMPOS_CONTACTO = {
  responsable: deleteField(),
  relacion: deleteField(),
  direccion: deleteField(),
  nombreContacto1: deleteField(),
  relacionContacto1: deleteField(),
  telefono1: deleteField(),
  nombreContacto2: deleteField(),
  relacionContacto2: deleteField(),
  telefono2: deleteField(),
  nombreContacto3: deleteField(),
  telefono3: deleteField(),
  nombreContacto4: deleteField(),
  telefono4: deleteField(),
  nombreContacto5: deleteField(),
  telefono5: deleteField(),
  fotoUrl: deleteField(),
};

export async function limpiarContactos(id: string): Promise<void> {
  await updateDoc(doc(db(), "alumnos", id), CAMPOS_CONTACTO);
}

export async function limpiarContactosGrado(
  grado: string,
  turno: string
): Promise<number> {
  const q = query(
    collection(db(), "alumnos"),
    where("grado", "==", grado),
    where("turno", "==", turno)
  );
  const snap = await getDocs(q);
  const updates = snap.docs.map((d) =>
    updateDoc(doc(db(), "alumnos", d.id), CAMPOS_CONTACTO)
  );
  await Promise.all(updates);
  return snap.size;
}

export async function eliminarGradoCompleto(
  grado: string,
  turno: string
): Promise<number> {
  const q = query(
    collection(db(), "alumnos"),
    where("grado", "==", grado),
    where("turno", "==", turno)
  );
  const snap = await getDocs(q);
  const deletes = snap.docs.map((d) => deleteDoc(doc(db(), "alumnos", d.id)));
  await Promise.all(deletes);
  return snap.size;
}

function buildAlumno(data: Record<string, unknown>): Omit<Alumno, "id"> {
  return {
    nombreCompleto: String(data["nombreCompleto"] ?? ""),
    grado: String(data["grado"] ?? "") as Alumno["grado"],
    turno: data["turno"] === "tarde" ? "tarde" : "manana",
    telefono1: data["telefono1"] ? String(data["telefono1"]) : undefined,
    telefono2: data["telefono2"] ? String(data["telefono2"]) : undefined,
    nombreContacto1: data["nombreContacto1"] ? String(data["nombreContacto1"]) : undefined,
    nombreContacto2: data["nombreContacto2"] ? String(data["nombreContacto2"]) : undefined,
    relacionContacto1: data["relacionContacto1"] ? String(data["relacionContacto1"]) : undefined,
    relacionContacto2: data["relacionContacto2"] ? String(data["relacionContacto2"]) : undefined,
    nombreContacto3: data["nombreContacto3"] ? String(data["nombreContacto3"]) : undefined,
    telefono3: data["telefono3"] ? String(data["telefono3"]) : undefined,
    nombreContacto4: data["nombreContacto4"] ? String(data["nombreContacto4"]) : undefined,
    telefono4: data["telefono4"] ? String(data["telefono4"]) : undefined,
    nombreContacto5: data["nombreContacto5"] ? String(data["nombreContacto5"]) : undefined,
    telefono5: data["telefono5"] ? String(data["telefono5"]) : undefined,
    fotoUrl: data["fotoUrl"] ? String(data["fotoUrl"]) : undefined,
    dni: data["dni"] ? String(data["dni"]) : undefined,
    fechaNacimiento: data["fechaNacimiento"] ? String(data["fechaNacimiento"]) : undefined,
    sexo: data["sexo"] ? String(data["sexo"]) : undefined,
  };
}
