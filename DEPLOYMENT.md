# 🚀 Guía de Deployment

## Cloud Run (producción actual)

Script existente:

```bash
cd /home/alvaro/.openclaw/workspace/projects-dashboard
./scripts/cloudrun-deploy-projects-dashboard.sh boatcheckpro-20260222-21988 europe-west1 projects-dashboard
```

Verificación rápida:

```bash
npm run build
curl -I https://projects-dashboard-<hash>-ew.a.run.app
```

> Nota: la persistencia JSON en Cloud Run es MVP (filesystem efímero). Para producción robusta mover `benchmark-projects` a DB/Storage.

## Railway (alternativa)

## Opción 1: Usando Railway CLI (Recomendado)

### Prerequisitos
- Railway CLI instalado: `npm i -g @railway/cli`
- Autenticación en Railway con token existente

### Pasos

1. **Conectarse a Railway**
   ```bash
   railway login --token YOUR_RAILWAY_TOKEN
   ```

2. **Navegar al directorio del proyecto**
   ```bash
   cd /home/alvaro/.openclaw/workspace/projects-dashboard
   ```

3. **Crear/Conectar proyecto en Railway**
   ```bash
   railway init
   # Seleccionar "Create a new project"
   # Nombre: projects-dashboard
   ```

4. **Desplegar**
   ```bash
   railway up
   ```

5. **Obtener URL de deployment**
   ```bash
   railway domain
   ```

---

## Opción 2: Usando Railway Dashboard (UI)

1. **Abrir Railway Dashboard**
   - Ve a https://railway.app/dashboard

2. **Crear Nuevo Proyecto**
   - Click en "New Project"
   - Selecciona "GitHub Repo" o "Deploy from Git"
   - Conecta este repositorio

3. **Configurar Variables de Entorno**
   - Ve a Settings → Variables
   - Asegúrate de que PORT esté establecido a 3000

4. **Desplegar**
   - Railway automáticamente desplegará cuando hagas push

---

## Opción 3: GitHub + Railway Automático

1. **Hacer push a GitHub**
   ```bash
   git remote add origin https://github.com/agavino1/projects-dashboard.git
   git branch -M main
   git push -u origin main
   ```

2. **En Railway Dashboard**
   - Create New Project → GitHub Repo
   - Seleccionar `projects-dashboard`
   - Railway automáticamente detectará Next.js

3. **Configurar Custom Domain**
   - En Railway Settings → Domain
   - Agregar: `projects.anayalvaro.com`

---

## Configurar Subdominio en Cloudflare/DNS

### Pasos en Cloudflare:

1. **Ir a DNS Records**
2. **Crear CNAME Record**
   - Name: `projects`
   - Target: Obtenido de Railway (ej: `projects-dashboard.railway.app`)
   - TTL: Auto
   - Proxy: Puede ser Proxied o DNS Only

3. **Esperar propagación**
   - ~5-30 minutos para que se propague

### Verificar
```bash
nslookup projects.anayalvaro.com
# Debe apuntar al dominio de Railway
```

---

## Variables de Entorno Necesarias

En Railway → Settings → Variables:

```env
PORT=3000
NODE_ENV=production
```

Opcional:
```env
NEXT_PUBLIC_GA_ID=tu_google_analytics_id
```

---

## Monitoreo y Logs

### Ver Logs en Railway
```bash
railway logs
```

### Health Check
Railway automáticamente verifica la salud de la app con:
- `GET http://localhost:3000`
- Debe responder con status 200

---

## Troubleshooting

### Error: "Cannot find module"
```bash
npm install
npm run build
# Luego hacer deploy
```

### Build falla
1. Verificar `tsconfig.json` está presente
2. Asegurarse que `package.json` tiene todos los scripts
3. Revisar logs de Railway para detalles específicos

### Custom domain no funciona
1. Verificar CNAME está correcto en DNS
2. Esperar 30 minutos para propagación
3. Limpiar caché del navegador (Ctrl+Shift+Del)
4. En Railway, verificar que el dominio está asignado correctamente

---

## Actualizar Después del Deploy

Después de hacer cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

Railway automáticamente redesplegará cuando detecte cambios en GitHub.

O manualmente con CLI:
```bash
railway up
```

---

## URLs Finales

- **Production**: https://projects.anayalvaro.com
- **Railway Service**: Obtenido después de desplegar
- **GitHub Repo**: https://github.com/agavino1/projects-dashboard

---

## Support

Para problemas con Railway:
- Documentación: https://docs.railway.app
- Status: https://www.railway.app/status
- Soporte: support@railway.app
