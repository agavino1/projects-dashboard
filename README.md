# 🎯 Proyectos de Álvaro - Dashboard Interactivo

Dashboard visual interactivo que muestra el estado de todos los proyectos de Álvaro Gaviño González en tiempo real.

## ✨ Características

- **Grid Responsive**: Se adapta automáticamente a 1, 2 o 3 columnas según el tamaño de pantalla
- **8 Proyectos Integrados**: Todos los proyectos actuales con datos completos
- **Estado Visual**: Badges para Activo 🟢, Progreso 🟡, Research 🔵, Completado ✅
- **Barras de Progreso**: Visualización clara del avance de cada proyecto (0-100%)
- **Bloqueos Identificados**: Muestra 1-2 bloqueos principales o "Sin bloqueos"
- **Enlaces Rápidos**: Botones para GitHub, Landing, Documentación, Next Step
- **Expandible**: Click en tarjeta para ver descripción completa y detalles
- **Filtros Dinámicos**: Por Estado y por Categoría
- **Dark Mode**: Soporte completo para tema oscuro
- **Diseño Mobile-First**: Optimizado para celular, tablet y desktop

## 🛠️ Tech Stack

- **Framework**: Next.js 15 + TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: React 19
- **Deployment**: Railway

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/agavino1/projects-dashboard.git
cd projects-dashboard

# Instalar dependencias
npm install

# Crear archivo .env (opcional)
cp .env.example .env.local
```

## 🚀 Desarrollo

```bash
# Servidor de desarrollo (puerto 3000)
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## 📊 Proyectos Incluidos

1. **🏔️ Sierra Nevada Property Monitor** - Monitoreo automático de apartamentos
2. **🚤 BoatCheckPro** - SaaS para inspecciones pre-compra de embarcaciones
3. **💰 Auto Income Opportunities** - Plataforma de evaluación de ingresos pasivos
4. **❄️ Rapid Cooling Research** - Investigación académica
5. **📖 Wikipedia** - Página Wikipedia de Álvaro
6. **🎫 Toros Morante Monitor** - Monitor de entradas de toros
7. **🔗 LinkedIn BECO+IA** - Pipeline de contenido LinkedIn
8. **📚 Libros** - 4 libros en desarrollo

## 📁 Estructura del Proyecto

```
projects-dashboard/
├── app/
│   ├── page.tsx           # Página principal con lógica
│   ├── layout.tsx         # Layout global
│   └── globals.css        # Estilos globales
├── components/
│   ├── ProjectCard.tsx    # Componente de tarjeta de proyecto
│   └── FilterBar.tsx      # Componente de filtros
├── data/
│   └── projects.ts        # Datos de los 8 proyectos
├── tailwind.config.ts     # Configuración de Tailwind
├── tsconfig.json          # Configuración de TypeScript
└── package.json           # Dependencias
```

## 🌐 Deployment en Railway

El proyecto está configurado para desplegarse en Railway:

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login en Railway
railway login

# Desplegar
railway up
```

O conectar directamente desde el dashboard de Railway vinculando este repositorio.

## 🔧 Configuración de Subdominio

Para mapear `projects.anayalvaro.com`:

1. En Railway, ir a Settings → Domain
2. Agregar dominio custom: `projects.anayalvaro.com`
3. En tu proveedor DNS (Cloudflare/Namecheap), crear CNAME:
   ```
   projects CNAME projects-dashboard.railway.app
   ```

## 📝 Actualizar Proyectos

Editar `/data/projects.ts` para:
- Agregar nuevos proyectos
- Actualizar progreso y estado
- Cambiar bloqueos
- Modificar enlaces

```typescript
export const projects: Project[] = [
  {
    id: 'nuevo-proyecto',
    emoji: '🎯',
    name: 'Nuevo Proyecto',
    status: 'progress',
    category: 'tech',
    progress: 45,
    // ... resto de campos
  }
]
```

## 🎨 Dark Mode

El dashboard detecta automáticamente la preferencia del sistema y permite toggle manual con el botón 🌙 en la esquina superior derecha.

## 📱 Responsive Design

- **Mobile** (< 640px): 1 columna
- **Tablet** (640-1024px): 2 columnas
- **Desktop** (> 1024px): 3 columnas

## 🔗 Enlaces Útiles

- **GitHub**: https://github.com/agavino1/projects-dashboard
- **Live Demo**: https://projects.anayalvaro.com
- **Railway Dashboard**: https://railway.app

## 📄 Licencia

Privado - Proyecto de Álvaro Gaviño González

## 👤 Autor

**Álvaro Gaviño González**
- 📧 Email: Agavino@gmail.com
- 🐙 GitHub: https://github.com/agavino1
- 🔗 LinkedIn: [Perfil LinkedIn]
