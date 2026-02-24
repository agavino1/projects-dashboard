import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'RIS — Dashboard de Proyectos',
  description: 'Revenue Improvement Solutions — Dashboard de Proyectos',
  keywords: ['proyectos', 'dashboard', 'RIS'],
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
