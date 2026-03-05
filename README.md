# Web App Lifecycle Platform (WLP)

A micro-frontend management platform that lets you **register, deploy, and orchestrate** independent web applications from a single admin interface. Built with [wujie](https://github.com/nicedoc/nicedoc.io) for sandbox isolation and [Supabase](https://supabase.com) as the backend.

> **Problem it solves:** In organizations running multiple frontend projects, each team ships independently but there's no unified way to register apps, manage multi-environment deployments, or compose them into a single user-facing portal. WLP fills that gap.

## Demo

<!-- Update with your production URL after deploying -->
🔗 **Live demo:** _coming soon_

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Main App (WLP)                    │  │
│  │  ┌──────────┐  ┌──────────────────────────────┐   │  │
│  │  │ Sidebar  │  │        Content Area           │   │  │
│  │  │          │  │  ┌─────────────────────────┐  │   │  │
│  │  │  Home    │  │  │   Sub-App (wujie sandbox)│  │   │  │
│  │  │  Apps    │  │  │                         │  │   │  │
│  │  │  Admin   │  │  │  Independent React/Vue/ │  │   │  │
│  │  │  ...     │  │  │  Angular app loaded via │  │   │  │
│  │  │          │  │  │  URL from any Git repo  │  │   │  │
│  │  │          │  │  └─────────────────────────┘  │   │  │
│  │  └──────────┘  └──────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└──────────────────────────┬──────────────────────────────┘
                           │ /api/*
                           ▼
               ┌───────────────────────┐
               │   Vercel Serverless   │
               │   Functions (API)     │
               │                       │
               │  POST /api/apps       │
               │  POST /api/upload     │
               │  POST /api/webhooks   │
               │  GET  /api/deploy...  │
               └───────────┬───────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │      Supabase         │
               │                       │
               │  PostgreSQL (registry)│
               │  Storage (static dist)│
               └───────────────────────┘
```

### How it works

1. **Sub-apps register** in the `apps` table with a name, route rule, and entry URLs per environment (dev / test / staging / production).
2. **Main app fetches** the registry at startup via `GET /api/apps` and renders the sidebar dynamically.
3. When a user navigates to a sub-app route, **wujie loads the sub-app** inside an isolated sandbox (JS sandbox + shadow DOM), fetching its HTML/JS from the registered entry URL.
4. **Deployment** can happen via zip upload through the admin UI or automatically via Vercel webhook — both update the entry URL and record deployment history.

## Project Structure

```
webapp-lifecycle-platform/
├── apps/
│   ├── main-app/           # Host app + admin UI + API
│   │   ├── src/             # React frontend (Vite)
│   │   │   ├── admin/       # Admin pages (apps, deployments, environments)
│   │   │   ├── layout/      # Shell layout + sidebar
│   │   │   ├── micro/       # Sub-app loading (SubAppsContext, loader)
│   │   │   └── router/      # Route components (Home, SubAppContainer)
│   │   └── api/             # Vercel serverless functions
│   │       ├── apps/        # CRUD for app registry
│   │       ├── deployments/ # Deployment records
│   │       ├── environments/# Environment management
│   │       ├── upload/      # Zip upload deployment
│   │       └── webhooks/    # Vercel deploy webhook
│   ├── sub-supplier/        # Example sub-app (Supplier Management)
│   └── sub-goods/           # Example sub-app (Goods Management)
├── packages/
│   └── shared/              # Shared TypeScript types
├── templates/
│   └── sub-app-template/    # Starter template for new sub-apps
├── scripts/
│   └── supabase-schema.sql  # Database schema + seed data
└── config/
    └── environments.json    # Environment definitions
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Host App | React 18 + React Router + Vite |
| Micro-frontend | [wujie](https://github.com/nicedoc/nicedoc.io) (JS sandbox + shadow DOM) |
| API | Vercel Serverless Functions |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (for uploaded static builds) |
| Deployment | Vercel (host) + zip upload / webhook (sub-apps) |
| Monorepo | pnpm workspaces |

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/cindyzhu/webapp-lifecycle-platform.git
cd webapp-lifecycle-platform
pnpm install
```

### 2. Set up Supabase

1. Create a new Supabase project.
2. Run `scripts/supabase-schema.sql` in the SQL Editor to create tables. The script includes seed data at the bottom for local development — **skip the `INSERT` statements for production**, as sub-apps are registered through the admin UI.
3. Go to **Settings → Storage** and create a bucket named `sub-app-assets` (set to public).

### 3. Configure environment

Create `apps/main-app/.env.local`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Start development

```bash
# Terminal 1 — API dev server
cd apps/main-app && pnpm dev:api

# Terminal 2 — Main app
pnpm dev

# Terminal 3 & 4 — Sub-apps (optional)
pnpm dev:supplier   # http://localhost:5174
pnpm dev:goods      # http://localhost:5175
```

Open `http://localhost:5173` — the main app loads sub-apps dynamically from the registry.

## Creating a Sub-App

A sub-app can live in **any Git repository** with any framework. It only needs two things:

### 1. Implement wujie lifecycle hooks

```tsx
// src/main.tsx
if (window.__POWERED_BY_WUJIE__) {
  let root = null;
  window.__WUJIE_MOUNT = () => {
    const container = window.$wujie.shadowRoot.querySelector('#root');
    if (!container) return;
    root = ReactDOM.createRoot(container);
    root.render(<App />);
  };
  window.__WUJIE_UNMOUNT = () => {
    root?.unmount();
  };
  window.__WUJIE.mount();
} else {
  // Standalone mode
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
}
```

### 2. Enable CORS in dev server

```ts
// vite.config.ts
export default defineConfig({
  server: { port: 5176, cors: true },
});
```

Then register it in the admin UI (`/#/admin/apps` → **+ Add App**).

See `templates/sub-app-template/` for a complete starter.

## Deployment

### Main App (Vercel)

1. Import the repo in Vercel.
2. Set **Root Directory** to `apps/main-app`.
3. Add environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
4. Push to `main` to trigger deployment.

### Sub-Apps

Two options:

| Method | How |
|--------|-----|
| **Zip upload** | `pnpm build` → zip the `dist/` folder → upload in admin UI (App Detail → Upload Static Build) |
| **Vercel webhook** | Deploy sub-app to Vercel → configure webhook to `POST /api/webhooks/vercel` with `{ app_name, url, branch }` |

Both methods auto-update the entry URL for the target environment and record deployment history.

## Admin Features

- **App Registry** — Register, edit, activate/deactivate sub-apps
- **Multi-environment URLs** — Separate entry URLs for dev / test / staging / production
- **Deployment History** — Track every deployment with version, status, and deployer
- **Environment Management** — Configure deployment targets
- **Zip Upload** — Drag-and-drop `dist.zip` deployment to Supabase Storage

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apps` | List all registered apps |
| POST | `/api/apps` | Register a new app |
| GET | `/api/apps/:id` | Get app details |
| PUT | `/api/apps/:id` | Update app |
| DELETE | `/api/apps/:id` | Delete app |
| POST | `/api/upload` | Upload dist.zip and deploy |
| POST | `/api/webhooks/vercel` | Auto-deploy via Vercel webhook |
| GET | `/api/deployments` | List deployment history |
| GET/POST | `/api/environments` | Manage environments |

## License

MIT
