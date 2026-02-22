export interface Project {
  id: string;
  emoji: string;
  name: string;
  status: 'active' | 'progress' | 'research' | 'completed';
  category: 'tech' | 'content' | 'research' | 'product';
  progress: number;
  description: string;
  blockers: string[];
  lastUpdated: string;
  links: {
    github?: string;
    landing?: string;
    docs?: string;
    nextStep?: string;
  };
}

export const projects: Project[] = [
  {
    id: 'sierra-nevada',
    emoji: '🏔️',
    name: 'Sierra Nevada Property Monitor',
    status: 'active',
    category: 'tech',
    progress: 70,
    description: 'Monitoreo automático de apartamentos en Sierra Nevada (3 hab, 2 baños). Notificaciones cada 6 horas desde Pisos.com. Próxima mejora: agregar Inmobiliario.es y dashboard web.',
    blockers: ['Agregar Inmobiliario.es', 'Dashboard web'],
    lastUpdated: '0 días',
    links: {
      github: 'https://github.com/agavino1/sierra-nevada-dashboard',
      landing: 'https://properties.anayalvaro.com',
      nextStep: 'Expandir portales de búsqueda',
    }
  },
  {
    id: 'boatcheckpro',
    emoji: '🚤',
    name: 'BoatCheckPro',
    status: 'progress',
    category: 'tech',
    progress: 30,
    description: 'SaaS para inspecciones pre-compra de embarcaciones. Incluye inspección, gestoría y seguros. Aumenta confianza en compras. Landing page pendiente en 1 semana.',
    blockers: ['Landing page'],
    lastUpdated: '3 días',
    links: {
      github: 'https://github.com/agavino1/boatcheckpro',
      landing: 'https://boatcheckpro.anayalvaro.com',
      nextStep: 'Publicar landing page',
    }
  },
  {
    id: 'auto-income',
    emoji: '💰',
    name: 'Auto Income Opportunities',
    status: 'progress',
    category: 'tech',
    progress: 40,
    description: 'Plataforma de evaluación de ingresos pasivos. Ganadora: Affiliate marketing en nicho (8/10). MVP y customer discovery en 2 semanas.',
    blockers: ['Customer discovery', 'MVP desarrollo'],
    lastUpdated: '2 días',
    links: {
      github: 'https://github.com/agavino1/auto-income',
      nextStep: 'Entrevistas con clientes potenciales',
    }
  },
  {
    id: 'rapid-cooling',
    emoji: '❄️',
    name: 'Rapid Cooling Research',
    status: 'research',
    category: 'research',
    progress: 50,
    description: 'Investigación académica sobre tecnologías de enfriamiento rápido. Paper en progreso para publicación en revista científica.',
    blockers: ['Finalizar paper'],
    lastUpdated: '5 días',
    links: {
      docs: 'https://docs.google.com/document/d/example',
      nextStep: 'Completar y enviar paper a revista',
    }
  },
  {
    id: 'wikipedia',
    emoji: '📖',
    name: 'Wikipedia - Álvaro Gaviño González',
    status: 'completed',
    category: 'content',
    progress: 100,
    description: 'Página Wikipedia completada con outline biográfico. Plan de actualización cada 6 meses. Esperando que Álvaro rellene su información personal.',
    blockers: [],
    lastUpdated: '7 días',
    links: {
      docs: 'https://docs.google.com/document/d/example',
      nextStep: 'Álvaro rellena formulario con su info',
    }
  },
  {
    id: 'toros-morante',
    emoji: '🎫',
    name: 'Toros Morante Monitor',
    status: 'completed',
    category: 'tech',
    progress: 100,
    description: 'Monitor de entradas de toros Morante completamente funcional con documentación. Sistema listo para usar. Espera configuración de Telegram token.',
    blockers: [],
    lastUpdated: '10 días',
    links: {
      github: 'https://github.com/agavino1/toros-morante-monitor',
      nextStep: 'Álvaro configura Telegram token',
    }
  },
  {
    id: 'linkedin-beco-ia',
    emoji: '🔗',
    name: 'LinkedIn BECO+IA Content',
    status: 'completed',
    category: 'content',
    progress: 100,
    description: 'Pipeline autónomo de contenido LinkedIn con 10 posts en draft y 30+ ideas. Sistema completamente estructurado. Esperando aprobación de posts para publicación.',
    blockers: [],
    lastUpdated: '8 días',
    links: {
      docs: 'https://docs.google.com/spreadsheets/d/example',
      nextStep: 'Álvaro aprueba posts para publicación',
    }
  },
  {
    id: 'libros',
    emoji: '📚',
    name: 'Libros (4 Temas)',
    status: 'completed',
    category: 'content',
    progress: 100,
    description: '4 libros en outline: BEco, Economics, Love Your Brain, Tesis IA. Incluye templates de Cap 1 y plan de 24-30 meses. Esperando que Álvaro defina tema Tesis IA y elija libro para comenzar.',
    blockers: [],
    lastUpdated: '6 días',
    links: {
      docs: 'https://docs.google.com/drive/folders/example',
      nextStep: 'Álvaro elige libro para comenzar',
    }
  },
  {
    id: 'phone-language-bot',
    emoji: '🎓',
    name: 'Phone Language Bot',
    status: 'progress',
    category: 'product',
    progress: 20,
    description: 'Clases de inglés automatizadas por teléfono (IVR) para inmigrantes en USA. Stack: Twilio + Claude + Node.js.',
    blockers: ['Setup Twilio productivo', 'Definir guión pedagógico inicial'],
    lastUpdated: '0 días',
    links: {
      nextStep: 'Cerrar setup Twilio y lanzar MVP controlado',
    }
  },
  {
    id: 'paella-burner',
    emoji: '🍲',
    name: 'Paella Burner (Gas Cooker)',
    status: 'research',
    category: 'product',
    progress: 15,
    description: 'Quemador premium exterior con auto-nivelación y protección de viento. En fase de investigación y diseño de prototipo.',
    blockers: ['Partner de ingeniería', 'Primer diseño CAD'],
    lastUpdated: '0 días',
    links: {
      nextStep: 'Definir especificaciones técnicas y validación de prototipo',
    }
  },
  {
    id: 'instagram-motivation',
    emoji: '📱',
    name: 'Instagram Motivación + Música',
    status: 'progress',
    category: 'content',
    progress: 25,
    description: 'Nueva cuenta de contenido motivacional con música potente. Pipeline con aprobación manual antes de publicar.',
    blockers: ['Conectar cuenta IG', 'Definir flujo de publicación estable'],
    lastUpdated: '0 días',
    links: {
      nextStep: 'Publicar primer lote (semana 1) con revisión humana',
    }
  },
  {
    id: 'disneyland-paris',
    emoji: '🏰',
    name: 'Disneyland Paris',
    status: 'progress',
    category: 'product',
    progress: 20,
    description: 'Proyecto Disneyland Paris (planning/ejecución) para organizar próximos pasos y seguimiento.',
    blockers: ['Definir alcance exacto', 'Aterrizar plan operativo'],
    lastUpdated: '0 días',
    links: {
      nextStep: 'Definir objetivos y entregables de la siguiente iteración',
    }
  }
];

export const statusConfig = {
  active: { label: '🟢 Activo', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
  progress: { label: '🟡 Progreso', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' },
  research: { label: '🔵 Research', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
  completed: { label: '✅ Completado', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' }
};

export const categoryConfig = {
  tech: { label: 'Técnico', color: 'bg-slate-200 dark:bg-slate-700' },
  content: { label: 'Contenido', color: 'bg-amber-200 dark:bg-amber-700' },
  research: { label: 'Research', color: 'bg-cyan-200 dark:bg-cyan-700' },
  product: { label: 'Producto', color: 'bg-pink-200 dark:bg-pink-700' }
};
