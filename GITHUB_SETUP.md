# 📱 GitHub Repository Setup

## Crear Repositorio en GitHub

### Opción 1: Usando GitHub CLI

```bash
# Instalar GitHub CLI (si no lo tienes)
# macOS: brew install gh
# Windows: choco install gh
# Linux: apt-get install gh (debian/ubuntu)

# Login en GitHub
gh auth login

# Crear repositorio
gh repo create projects-dashboard \
  --source=/home/alvaro/.openclaw/workspace/projects-dashboard \
  --remote=origin \
  --push \
  --private \
  --description="Álvaro's Projects Dashboard - Interactive grid view"
```

### Opción 2: Usando Interfaz Web

1. **Ir a GitHub.com**
   - Iniciar sesión con `agavino1`

2. **Click en "New Repository"** (botón + arriba a la derecha)

3. **Llenar formulario:**
   - **Repository name:** `projects-dashboard`
   - **Description:** `Álvaro's Projects Dashboard - Interactive grid view`
   - **Visibility:** Private (o Public si lo deseas)
   - **Initialize with README:** NO (ya lo tenemos)
   - **Add .gitignore:** NO (ya lo tenemos)
   - **Add license:** NO (privado)

4. **Click "Create repository"**

5. **Conectar repositorio local:**
   ```bash
   cd /home/alvaro/.openclaw/workspace/projects-dashboard
   
   git remote add origin https://github.com/agavino1/projects-dashboard.git
   git branch -M main
   git push -u origin main
   ```

---

## Configurar Railway Integration

### En GitHub Repository Settings:

1. **Settings → Secrets and variables → Actions**

2. **Crear nuevo "Repository Secret":**
   - **Name:** `RAILWAY_TOKEN`
   - **Value:** `tu_railway_token_aqui`
   
   (Ya tienes este token de Railway)

3. **Guardar**

Después, cuando hagas `git push`, GitHub automáticamente:
- Ejecuta tests/build
- Si es rama `main`, despliega a Railway
- Actualiza `projects.anayalvaro.com`

---

## Pasos Completos (Resumen)

```bash
# 1. Crear repo en GitHub.com (o con GitHub CLI)

# 2. Conectar repositorio local
cd /home/alvaro/.openclaw/workspace/projects-dashboard
git remote add origin https://github.com/agavino1/projects-dashboard.git
git branch -M main

# 3. Hacer push inicial
git push -u origin main

# 4. Agregar Railway Token a GitHub Secrets
# En GitHub.com:
# Settings → Secrets and variables → Actions → New repository secret
# Name: RAILWAY_TOKEN
# Value: (tu railway token)

# 5. ¡Listo! Ahora cualquier push a main despliega automáticamente
git add data/projects.ts
git commit -m "Update: Proyecto X cambios"
git push origin main
# Railway automáticamente redesplegará en 2-5 minutos
```

---

## Verificar que Funcionó

1. **En GitHub:** Ve a "Actions" tab
   - Debes ver workflow ejecutándose
   - Cuando se ponga verde ✅, el deployment se completó

2. **En Railway:** Ve a https://railway.app/dashboard
   - Busca "projects-dashboard"
   - Debe mostrar "Deployment successful"

3. **En tu navegador:**
   - Ve a https://projects.anayalvaro.com
   - ¡Debes ver el dashboard!

---

## Archivo de Configuración de Workflow

El archivo `.github/workflows/deploy.yml` ya está configurado para:

✅ Ejecutarse en cada push a `main`
✅ Instalar dependencias
✅ Compilar Next.js
✅ Desplegar a Railway (si es rama main)
✅ Notificar el resultado

---

## Actualizar Proyectos Después

Flujo simple:

```bash
# 1. Editar /data/projects.ts
# 2. Probar localmente
npm run dev  # http://localhost:3000

# 3. Commit y push
git add data/projects.ts
git commit -m "Update: Sierra Nevada - progreso 75%"
git push origin main

# 4. ¡Listo! Railway redesplegará automáticamente
# (ver status en GitHub Actions o Railway Dashboard)
```

---

## Troubleshooting

### GitHub Actions falla
1. Ve a Actions tab
2. Click en el workflow que falló
3. Ver logs detallados
4. Problemas comunes:
   - RAILWAY_TOKEN no configurado → Agregar a Secrets
   - npm ci falla → Verificar package-lock.json
   - Build falla → Ver errores en logs, revisar TypeScript

### Railway no se despliega después de push
1. Verificar que GitHub Actions workflow pasó ✅
2. Verificar RAILWAY_TOKEN es válido en GitHub Secrets
3. Revisar Railway logs: `railway logs`

### Push a GitHub falla
```bash
# Verificar conexión SSH/HTTPS
git remote -v

# Si es problema de autenticación:
gh auth login
# O configurar SSH key en GitHub
```

---

## URLs Importantes

- **GitHub Repo:** https://github.com/agavino1/projects-dashboard
- **Railway Dashboard:** https://railway.app/dashboard
- **Live Dashboard:** https://projects.anayalvaro.com
- **GitHub Actions:** https://github.com/agavino1/projects-dashboard/actions
- **Railway Service Logs:** https://railway.app/dashboard/projects-dashboard

---

## Próximos Pasos

1. ✅ Crear repositorio en GitHub
2. ✅ Agregar RAILWAY_TOKEN a GitHub Secrets
3. ✅ Hacer primer push (git push origin main)
4. ✅ Esperar a que GitHub Actions y Railway terminen (5-10 min)
5. ✅ Verificar en https://projects.anayalvaro.com
6. ✅ ¡Listo para mantener actualizado!

---

## Mantener Sincronizado

**Después de actualizar proyectos en MEMORY.md:**

```bash
# 1. Actualizar /data/projects.ts si es necesario
# 2. Probar
# 3. Commit y push
git add data/projects.ts
git commit -m "Sync with MEMORY.md - project updates"
git push origin main
```

Eso es todo. El dashboard se actualizará automáticamente.
