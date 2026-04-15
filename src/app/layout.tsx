import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Centro Educativo Franciscano",
  description: "Sistema de contactos - Escuela Primaria San Francisco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}

        <footer className="pie">
          <div className="text-center">
            <h5 className="cont">Contáctanos</h5>
            <div className="social-section">

              {/* WhatsApp Nivel Primario */}
              <div className="social-group">
                <h6>Nivel <br />Inicial-Primario</h6>
                <a
                  href="https://api.whatsapp.com/send?phone=5493425135795&text=Hola, Bienvenido/a al C.E.F. del nivel PRIMARIO, en que te puedo ayudar."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-link"
                  aria-label="WhatsApp Nivel Primario"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>

              {/* Instagram Niveles Inicial y Primario */}
              <div className="social-group">
                <h6>Niveles<br />Inicial-Primario</h6>
                <a
                  href="https://www.instagram.com/escuelasanfrancisco1001sf?igsh=OTllaTZ6eTRkMGI0&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-link"
                  aria-label="Instagram Nivel Primario"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>

              {/* YouTube */}
              <div className="social-group">
               <h6>YouTube<br />&nbsp;</h6>
                <a
                  href="https://www.youtube.com/@CEFSanFrancisco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                  aria-label="YouTube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>

            </div>

            {/* Copyright */}
            <div className="copyright-container">
              <p className="copyright">
                © Copyright 2025{" "}
                <span className="jpr-cursiva">Juan Pablo, Rodríguez.</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
