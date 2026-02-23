import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Proyectos de Álvaro - Dashboard Interactivo',
  description: 'Vista completa del estado de todos los proyectos de Álvaro Gaviño González',
  keywords: ['proyectos', 'portfolio', 'dashboard', 'álvaro gaviño'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-100 dark:bg-dark-bg text-gray-900 dark:text-white transition-colors duration-200">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
