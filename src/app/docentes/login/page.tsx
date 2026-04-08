"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getApp } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import MusicPlayer from '../../../components/MusicPlayer';

export default function DocentesLoginPage() {
  const router = useRouter();
  const [email] = useState("docentes@cef-sanfrancisco.edu.ar");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(getApp()), email, password);
      router.push("/docentes/dashboard");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      console.error("[Login Docentes] Error Firebase:", err);
      toast.error(code || "Error desconocido", { duration: 6000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
      <Toaster />

      {/* Botón volver */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-white/80 hover:text-white text-sm flex items-center gap-1 transition"
      >
        ← Volver
      </Link>

      {/* Fondo con overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/escuela-drom.jpg"
          alt="Escuela San Francisco"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* Formulario central */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">

          {/* Logo */}
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white/80 shadow-xl">
            <Image
              src="/logo-primaria.png"
              alt="Logo Escuela Primaria San Francisco"
              width={120}
              height={120}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <h1 className="text-3xl font-bold text-white drop-shadow-lg text-center">
            Acceso Docentes
          </h1>

          {/* Card formulario */}
          <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-white/80">Email</p>
                <p className="text-sm text-white/60 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                  {email}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300 hover:text-yellow-100"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-lg transition">
                Ingresar
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center pb-6 px-4">
        <p className="text-white/40 text-xs italic">
          © 2025 Rodriguez Juan Pablo — Todos los derechos reservados
        </p>
      </footer>
      <MusicPlayer src="/starostin-comedy-cartoon-funny-background-music-492540.mp3" />
    </main>
  );
}
