import { BotonFlotanteJuego } from "@/components/juego/BotonFlotanteJuego";

export default function PadresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BotonFlotanteJuego />
    </>
  );
}