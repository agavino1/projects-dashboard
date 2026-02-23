import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, BarChart3, TestTube, Home } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                🧠 Álvaro Gaviño
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
                <Brain size={16} className="mr-2" />
                Dashboard Omnisciente
              </Link>
              
              <Link
                href="/classic"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/classic')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home size={16} className="mr-2" />
                Dashboard Clásico
              </Link>
              
              <Link
                href="/benchmark"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/benchmark')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <BarChart3 size={16} className="mr-2" />
                Benchmark
              </Link>
              
              <Link
                href="/simulator"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/simulator')
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <TestTube size={16} className="mr-2" />
                Simulator
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center">
                <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
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
            🧠 Dashboard Omnisciente
          </Link>
          
          <Link
            href="/classic"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/classic')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Dashboard Clásico
          </Link>
          
          <Link
            href="/benchmark"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/benchmark')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Benchmark
          </Link>
          
          <Link
            href="/simulator"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/simulator')
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            Simulator
          </Link>
        </div>
      </div>
    </nav>
  );
}