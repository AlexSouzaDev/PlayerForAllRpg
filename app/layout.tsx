import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/components/providers/TRPCProvider";

export const metadata: Metadata = {
  title: "PlayerForAllRPG — Fichas de Personagem",
  description: "Sua ficha de personagem, em qualquer sistema, sempre com você.",
  openGraph: {
    title: "PlayerForAllRPG",
    description: "Crie, gerencie e compartilhe fichas de personagem para qualquer sistema de RPG.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
