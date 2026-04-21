"use client";

import Link from "next/link";

export function BotonFlotanteJuego() {
  return (
    <Link
      href="/padres/juego"
      className="fixed bottom-6 right-20 z-50 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-3 px-4 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
      title="Descubrí el mensaje secreto de tu grado"
    >
      <span className="text-xl">🗝️</span>
      <span className="text-sm hidden sm:inline">Mensaje secreto</span>
    </Link>
  );
}