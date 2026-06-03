# Website rendering architecture

The Cafing website uses **Next.js App Router** with **Server-Side Rendering (SSR)** for public, SEO-sensitive pages. Private and highly interactive routes use **client components** only where needed.

## Why `src/app/studio/` (not `src/app/app/`)

Next.js requires a folder named **`app`** for all routes (`src/app/`). That is the framework convention, not our product name.

The studio UI lives at the URL **`/studio`**, so the route folder is **`src/app/studio/`**:

```
src/app/           ← Next.js App Router (every Next project has this)
  page.tsx         → /
  studio/          → /studio, /studio/pricing, …
    page.tsx       → /studio (template picker — studio home)
```

Previously this was named `app`, which produced confusing `app/app/` on disk and URLs at `/app`. It is now **`studio`** for clarity.

## Why SSR

- Search engines receive fully rendered HTML for landing, studio home, templates, and pricing.
- Faster first paint: data is fetched on the server before HTML is sent.
- Editor links use real `<a href>` URLs (no JavaScript required to discover create flows).

## Route map

### Server-rendered (SEO)

| Path | Data source | Metadata |
|------|-------------|----------|
| `/` | Static content | `metadata` export |
| `/studio` | `apiServer` — templates + categories (home = pick a template) | `generateMetadata` |
| `/studio/pricing` | `apiServer` — pricing plans | `metadata` |

These pages are **async Server Components**. They must not include `'use client'` at the page level.

### Client-rendered (no SEO)

| Path | Reason |
|------|--------|
| `/studio/projects` | User workspace; POST to create project then redirect |
| `/studio/account` | Account/settings placeholder |
| `/studio/cart` | Cart/checkout placeholder |

These pages use `'use client'` at the top of `page.tsx` and `apiClient` for mutations/fetches.

## Component layers

```
src/
├── app/                    # Routes (pages default to Server Components)
├── components/             # Server Components (no 'use client')
│   └── client/             # Client Components (events, hooks only)
└── lib/
    ├── api-server.ts       # SSR fetches → API_URL
    ├── api-client.ts       # Browser fetches → /api rewrites
    ├── editor.ts           # getEditorUrl() — server + client safe
    └── editor-client.ts    # openEditor() — client only
```

### Server components (examples)

- `TemplateCard`, `BentoFeatured`, `CategoryScroll`, `FormatStrip`
- `CategoryFilter` (uses `<Link>` for filters — SSR-friendly)
- `PricingGrid`, `ProjectPreviewGrid`, `Sidebar`, `Topbar` (shell)

### Client components (examples)

- `SearchForm` — search submit navigates with `useRouter`
- `CreateProjectButton` — POST project then `openEditor()`
- `ActiveSidebar` — reads `usePathname()` for active nav state

## Data fetching

### On the server

```ts
import { apiServer } from '@/lib/api-server';

export default async function Page() {
  const { data } = await apiServer.getTemplates({ limit: '24' });
  // ...
}
```

Set in `.env`:

```env
API_URL=http://localhost:3001
```

### In the browser (client pages only)

```ts
import { apiClient } from '@/lib/api-client';

const projects = await apiClient.getProjects();
```

Uses same-origin `/api/*` rewrites from `next.config.ts` when `NEXT_PUBLIC_API_URL` is empty.

## Image editor

No in-app canvas. Links to the external **image-editor** project:

- **SSR:** `<a href={getEditorUrl({ templateId })}>`
- **After API mutation:** `openEditor()` from `@/lib/editor-client`

Env:

```env
NEXT_PUBLIC_IMAGE_EDITOR_URL=http://localhost:5174
```

## Adding a new page

1. **Public / needs SEO** → Server Component in `app/.../page.tsx`, fetch with `apiServer`, add `metadata`.
2. **Private / forms / cart** → `'use client'` page, use `apiClient` and components under `components/client/`.
3. **Button that only navigates** → Prefer `<a href={getEditorUrl(...)}>` in a Server Component.
4. **Button that mutates then navigates** → Small client component in `components/client/`.

## Cursor rule

See `.cursor/rules/nextjs-ssr.mdc` for AI/agent conventions in this repo.
