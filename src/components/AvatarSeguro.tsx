"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarSeguroProps {
  fotoUrl?: string;
  nombre: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Componente Avatar robusto con fallback cuando la foto falla
 * Muestra un icono de usuario si:
 * - No hay fotoUrl
 * - La URL falla a cargar (error de CORS, URL inválida, etc.)
 */
export function AvatarSeguro({
  fotoUrl,
  nombre,
  width = 64,
  height = 64,
  className = "w-16 h-16 rounded-full object-cover border border-white/20",
}: AvatarSeguroProps) {
  const [imagenFallo, setImagenFallo] = useState(false);

  // Si no hay fotoUrl o la imagen falló, mostrar icono
  if (!fotoUrl || imagenFallo) {
    return (
      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-8 h-8 text-white/30" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={fotoUrl}
      alt={nombre}
      width={width}
      height={height}
      className={className}
      onError={() => setImagenFallo(true)}
      unoptimized={false}
    />
  );
}
