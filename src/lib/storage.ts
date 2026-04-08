import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getApp } from "./firebase";

export async function subirFotoAlumno(alumnoId: string, file: File): Promise<string> {
  const storage = getStorage(getApp());
  const storageRef = ref(storage, `fotos/${alumnoId}.jpg`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
