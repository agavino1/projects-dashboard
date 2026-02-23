import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Brain } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 flex items-center">
                <Brain size={24} className="mr-2 text-blue-600" />
                Álvaro Gaviño
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard size={16} className="mr-2" />
                Dashboard de Proyectos
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Dashboard de Proyectos
          </Link>
        </div>
      </div>
    </nav>
  );
}