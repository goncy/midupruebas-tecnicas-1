import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "📚 Midulibritos",
  description: "Hola mamá, estoy en el stream de Midu",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="grid min-h-screen grid-rows-[60px,1fr,60px] gap-4">
        <header className="m-auto w-full max-w-screen-lg p-4">
          <h2 className="text-2xl font-medium">📚 Midulibritos</h2>
        </header>
        <main className="m-auto flex h-full  w-full max-w-screen-lg flex-col items-center justify-between px-4">
          {children}
        </main>
        <footer className="m-auto w-full max-w-screen-lg p-4 text-center">
          Hecho con ❤ por Goncy
        </footer>
      </body>
    </html>
  );
}
