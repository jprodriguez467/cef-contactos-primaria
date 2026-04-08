export type Turno = "manana" | "tarde";

export type Grado =
  | "Sala de 3"
  | "Sala de 4"
  | "Sala de 5"
  | "1° grado"
  | "2° grado"
  | "3° grado"
  | "4° grado"
  | "5° grado"
  | "6° grado"
  | "7° grado";

export const GRADOS: Grado[] = [
  "Sala de 3",
  "Sala de 4",
  "Sala de 5",
  "1° grado",
  "2° grado",
  "3° grado",
  "4° grado",
  "5° grado",
  "6° grado",
  "7° grado",
];

export const TURNOS: { value: Turno; label: string }[] = [
  { value: "manana", label: "Mañana" },
  { value: "tarde", label: "Tarde" },
];

export interface Alumno {
  id: string;
  nombreCompleto: string;
  grado: Grado;
  turno: Turno;
  nombreContacto1?: string;
  relacionContacto1?: string;
  telefono1?: string;
  nombreContacto2?: string;
  relacionContacto2?: string;
  telefono2?: string;
  nombreContacto3?: string;
  telefono3?: string;
  nombreContacto4?: string;
  telefono4?: string;
  nombreContacto5?: string;
  telefono5?: string;
  fotoUrl?: string;
  dni?: string;
  fechaNacimiento?: string;
  sexo?: string;
}
