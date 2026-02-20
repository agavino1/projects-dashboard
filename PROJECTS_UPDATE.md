# 📊 Cómo Actualizar los Proyectos

Este documento explica cómo mantener la información de los proyectos actualizada en el dashboard.

## 📝 Archivo Principal: `/data/projects.ts`

Todos los datos de los proyectos se almacenan en un solo archivo TypeScript. Editar este archivo es la única forma de actualizar el dashboard.

## 🔄 Estructura de un Proyecto

```typescript
{
  id: 'sierra-nevada',           // ID único (kebab-case)
  emoji: '🏔️',                  // Emoji representativo
  name: 'Sierra Nevada Property Monitor',  // Nombre del proyecto
  status: 'active',              // Estado: active | progress | research | completed
  category: 'tech',              // Categoría: tech | content | research | product
  progress: 70,                  // 0-100
  description: 'Descripción...'  // Párrafo completo (mostrarse en detalles)
  blockers: ['Bloq1', 'Bloq2'],  // Array de 0-N bloqueos
  lastUpdated: '0 días',         // String: "X días"
  links: {
    github?: 'URL',
    landing?: 'URL',
    docs?: 'URL',
    nextStep?: 'Texto del próximo paso'
  }
}
```

## 📋 Estados Disponibles

| Estado | Emoji | Color | Cuándo Usar |
|--------|-------|-------|------------|
| `active` | 🟢 | Verde | Proyecto en uso/producción |
| `progress` | 🟡 | Amarillo | En desarrollo/implementación |
| `research` | 🔵 | Azul | Investigación/análisis |
| `completed` | ✅ | Púrpura | Terminado/entregable listo |

## 🏷️ Categorías Disponibles

| Categoría | Nombre | Cuándo Usar |
|-----------|--------|------------|
| `tech` | Técnico | Código, SaaS, apps |
| `content` | Contenido | Escritura, LinkedIn, blogs |
| `research` | Research | Estudios, papers, investigación |
| `product` | Producto | Prototipos físicos, productos |

## ✏️ Ejemplo: Actualizar Sierra Nevada

**Antes:**
```typescript
{
  id: 'sierra-nevada',
  name: 'Sierra Nevada Property Monitor',
  status: 'active',
  progress: 70,
  lastUpdated: '0 días',
  blockers: ['Agregar Inmobiliario.es', 'Dashboard web'],
  // ...
}
```

**Después (si cambió algo):**
```typescript
{
  id: 'sierra-nevada',
  name: 'Sierra Nevada Property Monitor',
  status: 'active',           // Sigue activo
  progress: 75,               // ⬆️ Aumentó de 70 a 75
  lastUpdated: '1 día',       // ⬆️ Se actualizó hace 1 día
  blockers: ['Dashboard web'],  // ⬇️ Se completó Inmobiliario.es!
  description: 'Monitoreo automático de apartamentos... Plus: Inmobiliario.es integrado ✅',
  // ...
}
```

## 🎯 Cambios Comunes

### 1. Cambiar Estado
```typescript
status: 'progress'  // De "active" a "progress"
```

### 2. Actualizar Progreso
```typescript
progress: 85  // De 70 a 85 (ejemplo)
```

### 3. Agregar/Quitar Bloqueos
```typescript
// Agregar bloqueo
blockers: ['Bloq1', 'Bloq2', 'Bloq3 nuevo'],

// Quitar bloqueo
blockers: ['Bloq1'],  // Solo queda este

// Sin bloqueos
blockers: [],  // Array vacío
```

### 4. Actualizar Timestamp
```typescript
lastUpdated: '0 días',   // Hoy
lastUpdated: '2 días',   // Hace 2 días
lastUpdated: '1 semana', // Hace 1 semana
```

### 5. Agregar/Cambiar Enlaces
```typescript
links: {
  github: 'https://github.com/agavino1/sierra-nevada-monitor',
  landing: 'https://sierranevada.anayalvaro.com',  // Nuevo
  docs: 'https://docs.google.com/...',
  nextStep: 'Lanzar MVP con feedback de usuarios'   // Actualizado
}
```

## ➕ Agregar un Nuevo Proyecto

1. **Agregar objeto al array `projects`:**
```typescript
export const projects: Project[] = [
  // ... proyectos existentes ...
  
  // NUEVO PROYECTO
  {
    id: 'nuevo-proyecto',
    emoji: '🎯',
    name: 'Nombre del Proyecto',
    status: 'progress',
    category: 'tech',
    progress: 30,
    description: 'Descripción completa del proyecto...',
    blockers: ['Bloq1', 'Bloq2'],
    lastUpdated: '0 días',
    links: {
      github: 'https://github.com/agavino1/nuevo-proyecto',
      nextStep: 'Completar MVP'
    }
  }
];
```

2. **Hacer commit y push:**
```bash
git add data/projects.ts
git commit -m "Add: Nuevo Proyecto"
git push origin main
```

3. **Railway redesplegará automáticamente** (2-5 minutos)

## 🗑️ Eliminar un Proyecto

1. **Eliminar el objeto del array** en `/data/projects.ts`
2. **Hacer commit y push**
3. **Railway redesplegará**

Ejemplo:
```typescript
export const projects: Project[] = [
  // Sierra Nevada ✅ (sigue)
  { id: 'sierra-nevada', ... },
  
  // BoatCheckPro ❌ (eliminado)
  
  // Auto Income ✅ (sigue)
  { id: 'auto-income', ... },
];
```

## 🔍 Validación

Antes de hacer commit, verificar:

✅ Todos los campos están presentes
✅ IDs son únicos
✅ Estados son válidos: `'active' | 'progress' | 'research' | 'completed'`
✅ Categorías son válidas: `'tech' | 'content' | 'research' | 'product'`
✅ Progress es 0-100
✅ URLs son válidas (comienzan con `https://`)
✅ No hay duplicados en el array

## 🧪 Probar Cambios Localmente

```bash
cd /home/alvaro/.openclaw/workspace/projects-dashboard

# Si ya están instaladas las dependencias:
npm run dev

# Abrir http://localhost:3000
# Los cambios se reflejarán automáticamente (Fast Refresh)
```

## 🚀 Publicar Cambios

```bash
# 1. Editar /data/projects.ts
# 2. Probar localmente
# 3. Commit y push
git add data/projects.ts
git commit -m "Update: Proyecto X - cambio descripción"
git push origin main

# Railway automáticamente redesplegará en 2-5 minutos
# No necesitas hacer nada más
```

## 📊 Ejemplo Completo: Update Real

**Escenario:** BoatCheckPro avanzó de 30% a 45%, el landing está vivo, se completó bloqueador, cambio de "progress" a "active".

```typescript
// ANTES
{
  id: 'boatcheckpro',
  emoji: '🚤',
  name: 'BoatCheckPro',
  status: 'progress',        // ← Era progress
  category: 'tech',
  progress: 30,              // ← Era 30
  description: 'SaaS para inspecciones pre-compra de embarcaciones. Incluye inspección, gestoría y seguros. Aumenta confianza en compras. Landing page pendiente en 1 semana.',
  blockers: ['Landing page'],  // ← Tenía bloqueador
  lastUpdated: '3 días',
  links: {
    github: 'https://github.com/agavino1/boatcheckpro',
    nextStep: 'Publicar landing page',
  }
}

// DESPUÉS
{
  id: 'boatcheckpro',
  emoji: '🚤',
  name: 'BoatCheckPro',
  status: 'active',          // ← Ahora active ✅
  category: 'tech',
  progress: 45,              // ← Ahora 45 ✅
  description: 'SaaS para inspecciones pre-compra de embarcaciones. Landing page live. Includes inspección, gestoría y seguros. MVP aceptando primeros clientes beta.',
  blockers: [],              // ← Sin bloqueos ✅
  lastUpdated: '0 días',     // ← Actualizado hoy ✅
  links: {
    github: 'https://github.com/agavino1/boatcheckpro',
    landing: 'https://boatcheckpro.com',  // ← Nuevo link ✅
    nextStep: 'Onboarding de 5 clientes beta',
  }
}
```

---

## ⚠️ Importante

- **El dashboard es público** - cualquiera puede ver proyectos.anayalvaro.com
- **Usa descripción clara** - es el "elevator pitch" de cada proyecto
- **Actualiza regularmente** - el dashboard debe reflejar la realidad actual
- **Sincroniza con MEMORY.md** - mantén MEMORY.md y este dashboard en sync

---

## 💡 Tips

- Use emoji que sean reconocibles y representativos
- Descripciones cortas pero informativas (2-3 líneas)
- Los bloqueos deben ser actionables (qué falta para avanzar)
- "Última actualización" ayuda a saber qué tan fresco es el dato
- El "Próximo paso" es lo que debería hacerse a continuación
