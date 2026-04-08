import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getApp } from "./firebase";

const ADMIN_EMAIL = "admin@cef-sanfrancisco.edu.ar";

export async function loginDocente(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(getAuth(getApp()), email, password);
  return cred.user;
}

export async function loginAdmin(email: string, password: string): Promise<User> {
  if (email !== ADMIN_EMAIL) throw new Error("No autorizado");
  const cred = await signInWithEmailAndPassword(getAuth(getApp()), email, password);
  return cred.user;
}

export async function logout(): Promise<void> {
  await firebaseSignOut(getAuth(getApp()));
}

export function isAdmin(email: string | null | undefined): boolean {
  return email === ADMIN_EMAIL;
}

export { onAuthStateChanged, getAuth };
export type { User };
