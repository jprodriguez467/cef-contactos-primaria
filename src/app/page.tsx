import Link from "next/link";
import Image from "next/image";
import MusicPlayer from '../components/MusicPlayer';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">

      {/* Fondo con overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/portada-primario.jpg"
          alt="Escuela Primaria San Francisco"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Contenido central */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 w-full max-w-md mx-auto gap-8">

        {/* Logo + nombre */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white/80 shadow-xl">
            <Image
              src="/logo-institucional.png"
              alt="Logo Escuela Primaria San Francisco"
              width={120}
              height={120}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight drop-shadow-lg">
            Escuela Primaria<br />San Francisco
          </h1>
          <p className="text-white/70 text-base tracking-widest uppercase text-sm">
            Sistema de Contactos
          </p>
        </div>

        {/* Botones */}
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/padres"
            className="w-full bg-white hover:bg-gray-100 text-gray-800 text-center font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors text-base"
          >
            Cargar datos de contacto
          </Link>
          <Link
            href="/docentes/login"
            className="w-full bg-white/20 hover:bg-white/30 text-white text-center font-medium py-3 px-6 rounded-xl border border-white/40 backdrop-blur-sm transition-colors"
          >
            Acceso docentes
          </Link>
          <Link
            href="/admin/login"
            className="w-full bg-white/10 hover:bg-white/20 text-white/80 text-center text-sm py-3 px-6 rounded-xl border border-white/20 backdrop-blur-sm transition-colors"
          >
            Acceso administrador
          </Link>
        </div>
      </div>

   

      <MusicPlayer src="/moodmode-no-copyright-music-201745.mp3" />
    </main>
  );
}
