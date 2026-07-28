# Landing-back

API / backend de la landing, construido con **Next.js 16** y **Node.js 24**.

## Stack

| Tecnología | Versión |
|---|---|
| Next.js | 16.2.12 |
| React | 19.2.4 |
| Node.js | 24 (LTS) |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |

## Requisitos

- [Node.js 24+](https://nodejs.org/) (recomendado usar la versión del archivo `.nvmrc`)
- npm 10+
- [Docker](https://docs.docker.com/get-docker/) y Docker Compose (opcional, para contenedores)
- Git y una cuenta de GitHub

## Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanRomerWRST/Landing-back.git
cd Landing-back

# 2. Usar Node 24 (si tienes nvm)
nvm install
nvm use

# 3. Instalar dependencias
npm install

# 4. Levantar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts útiles

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run start    # servir build de producción
npm run lint     # ESLint
```

## Docker

### Producción

```bash
docker compose up --build -d
```

La app queda en [http://localhost:3000](http://localhost:3000).

```bash
# Ver logs
docker compose logs -f app

# Detener
docker compose down
```

### Desarrollo (hot-reload en contenedor)

```bash
docker compose --profile dev up --build
```

## Flujo de trabajo con Git (obligatorio)

### 1. Nunca trabajes directo en `main`

Crea siempre una rama nueva a partir de `main` actualizado:

```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-corto
# o: fix/..., docs/..., chore/...
```

### 2. Commits y push

```bash
git add .
git commit -m "Descripción clara del cambio"
git push -u origin HEAD
```

### 3. Abre un Pull Request y déjalo en revisión

1. Abre un PR hacia `main` en GitHub.
2. Completa la plantilla del PR.
3. **Deja el PR abierto a revisión** — no uses auto-merge y no pidas merge inmediato sin revisión.
4. Espera feedback; aplica los cambios en la misma rama.

### 4. Merge: solo el owner

**Únicamente `@JuanRomerWRST` puede hacer merge a `main`.**

El resto del equipo:

- puede abrir PRs
- puede comentar y solicitar cambios
- **no** puede fusionar a `main`

Esto se refuerza con:

- `.github/CODEOWNERS` → owner obligatorio: `@JuanRomerWRST`
- Reglas de protección de rama / ruleset en GitHub (ver abajo)
- Workflow `.github/workflows/pr-policy.yml`

## Configurar protección de `main` en GitHub (owner)

Hazlo una vez como administrador del repo (`JuanRomerWRST`):

1. Ve a **Settings → Rules → Rulesets → New branch ruleset**  
   (o **Settings → Branches → Add branch protection rule**).
2. Aplica la regla a `main`.
3. Activa:
   - **Require a pull request before merging**
   - **Require review from Code Owners**
   - **Dismiss stale pull request approvals when new commits are pushed**
   - **Block force pushes**
   - **Block deletions**
4. En **Restrict who can push / merge** (o bypass list):
   - permite merge / bypass **solo** a `JuanRomerWRST`
   - nadie más puede saltarse las reglas ni fusionar
5. Guarda el ruleset / la regla.

Con eso, los PRs quedan abiertos a revisión y el merge a `main` queda restringido a tu cuenta.

## Estructura del proyecto

```text
Landing-back/
├── src/                 # código de la app (App Router)
├── public/              # estáticos
├── .github/             # CODEOWNERS, plantilla PR, workflows
├── Dockerfile           # imagen de producción (Node 24)
├── docker-compose.yml   # producción + perfil dev
├── .nvmrc               # Node 24
├── next.config.ts
├── package.json
└── README.md
```

## Variables de entorno

Copia un `.env.example` cuando exista y crea tu `.env.local`.  
**Nunca** subas secretos al repositorio (`.env*` está en `.gitignore`).

## Licencia

Privado — uso interno del equipo.
