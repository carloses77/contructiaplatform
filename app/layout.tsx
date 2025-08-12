
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ConstructIA - Gestión Documental Inteligente para Construcción',
  description: 'La primera plataforma que usa Gemini AI de Google para automatizar completamente la gestión documental en construcción. Análisis predictivo, optimización automática y decisiones inteligentes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
