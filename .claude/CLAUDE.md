# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (requires PostgreSQL running)
npm run dev

# Build
npm run build

# Start built app
npm run start

# Lint
npm run lint

# Prisma: apply migrations to local DB
npx prisma migrate dev --name <migration-name>

# Prisma: regenerate client after schema changes
npx prisma generate

# Prisma: open DB browser
npx prisma studio

# Docker: build and run full stack
cd docker && docker compose up -d

# Docker: stop
cd docker && docker compose down

# Generate AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate ADMIN_PASSWORD_HASH (bcrypt, cost=12)
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 12))"
```

`.env` must contain `DATABASE_URL=postgresql://...` for local development.  
`.env.local` must contain `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` for auth.  
Docker Compose config and `.env.example` are in `docker/`.

## Architecture

**Stack**: Next.js 16.2 App Router · React 19 · Tailwind CSS v4 · Prisma v5 · PostgreSQL · `@milkdown/crepe` v7 · Auth.js v5 (next-auth@beta)

### Layer structure

```
Browser
  │
  ├── page request (SSR/ISR)
  │     └── src/proxy.ts              (Auth.js Edge proxy — route protection)
  │               └── app/**/page.tsx  (Server Component)
  │                         └── Service
  │                               └── Repository
  │                                     └── Prisma → PostgreSQL
  │
  └── data mutation (fetch)
        └── src/proxy.ts              (Auth.js Edge proxy — 401 for unauthenticated mutations)
                  └── app/api/**/route.ts  (API Route Handler)
                            └── Service
                                  └── Repository
                                        └── Prisma → PostgreSQL
```

- **proxy.ts** (`src/proxy.ts`): Auth.js v5 Edge middleware. Redirects unauthenticated page requests to `/login`, returns 401 for unauthenticated mutation API calls (POST/PUT/DELETE/PATCH).
- **Server Component** (`app/**/page.tsx`): Calls Service directly, renders initial HTML.
- **Client Component** (`components/**`): Calls API Routes via `fetch()` for mutations.
- **API Route** (`app/api/**/route.ts`): Validates input, calls Service, returns JSON.
- **Service** (`lib/services/**`): Business logic, throws custom errors.
- **Repository** (`lib/repositories/**`): Prisma queries, converts `Date` → ISO string.

### File structure

```
src/
├── auth.ts                               # Auth.js v5 config (Credentials provider, JWT callbacks)
├── proxy.ts                              # Auth.js Edge proxy (route protection, replaces middleware.ts)
├── app/
│   ├── layout.tsx                        # RootLayout (Header, metadataBase, OG defaults)
│   ├── page.tsx                          # / — ISR (revalidate=0), loads posts/categories/draft
│   ├── globals.css                       # Tailwind v4 + Milkdown overrides
│   ├── sitemap.ts                        # /sitemap.xml — dynamic, force-dynamic
│   ├── robots.ts                         # /robots.txt — disallows /write, /settings/
│   ├── login/
│   │   └── page.tsx                      # /login — redirects to / if already authenticated
│   ├── post/[id]/
│   │   ├── page.tsx                      # /post/:id — ISR (revalidate=0), generateMetadata, React.cache()
│   │   └── PostDetailWrapper.tsx         # dynamic-imports PostDetail (ssr: false)
│   ├── write/
│   │   └── page.tsx                      # /write — force-dynamic, loads draft + categories (admin only)
│   ├── settings/categories/
│   │   └── page.tsx                      # /settings/categories — force-dynamic (admin only)
│   └── api/
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts              # Auth.js internal endpoints (login, logout, session)
│       ├── posts/
│       │   ├── route.ts                  # GET /api/posts (public), POST /api/posts (admin)
│       │   └── [id]/route.ts             # GET (public) · PUT · DELETE /api/posts/:id (admin)
│       ├── draft/
│       │   └── route.ts                  # GET · PUT · DELETE /api/draft (admin only)
│       └── categories/
│           ├── route.ts                  # GET /api/categories (public), POST (admin)
│           └── [id]/route.ts             # DELETE /api/categories/:id (admin)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx                 # Client: credentials form, signIn(), error/loading state
│   │   └── LogoutButton.tsx              # Client: signOut({ callbackUrl: "/" })
│   ├── layout/Header.tsx                 # async Server Component: session-aware nav (admin vs guest)
│   ├── post/
│   │   ├── PostFeed.tsx                  # Client: search/category/tag filter via useMemo
│   │   ├── PostList.tsx
│   │   ├── PostCard.tsx                  # Search highlight
│   │   └── PostDetail.tsx                # Detail view + in-place edit (PUT /api/posts/:id)
│   ├── editor/
│   │   ├── MilkdownEditor.tsx            # Milkdown Crepe wrapper (ssr: false)
│   │   ├── WriteForm.tsx                 # New post form, 2s debounce auto-save draft
│   │   └── DraftBanner.tsx               # Banner on home when draft exists
│   ├── filter/
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── TagFilter.tsx
│   ├── settings/CategoryManager.tsx      # Category CRUD via API fetch
│   └── ui/
│       ├── Button.tsx                    # primary / secondary / danger variants
│       └── TagBadge.tsx
└── lib/
    ├── auth.ts                           # requireAdminPage() · requireAdminApi() — Defense-in-depth helpers
    ├── db/index.ts                       # Prisma Client singleton (dev hot-reload safe)
    ├── api.ts                            # apiSuccess · apiError · handleError
    ├── errors.ts                         # NotFoundError · ConflictError · ValidationError
    ├── actions/
    │   └── posts.ts                      # createPost · deletePost (redirect() 필요한 것만, requireAdminPage 포함)
    ├── services/
    │   ├── postService.ts
    │   ├── draftService.ts
    │   └── categoryService.ts
    ├── repositories/
    │   ├── postRepository.ts             # Post Prisma queries + Date → ISO string
    │   ├── draftRepository.ts            # Draft Prisma queries + Date → ISO string
    │   └── categoryRepository.ts        # Category Prisma queries + clearPostCategory
    ├── readingTime.ts                    # readingTime(content), summarize(content)
    └── highlight.ts                      # getHighlightParts(text, query)
```

### Data model

Three Prisma models: `Post`, `Draft`, `Category`.

- `Post.category` stores the category **name as a plain string** (not a FK). When a `Category` is deleted, posts are updated to `category = ""` via `prisma.post.updateMany` in `categoryRepository.clearPostCategory`.
- `Draft` is a **single-row table** with a hardcoded `id = "draft"`. Saved via `upsert`, deleted via `deleteMany`. Only used during new post creation (not when editing existing posts).
- `Post.tags` and `Draft.tags` are `String[]` (Postgres array). Repositories convert `createdAt`/`updatedAt`/`savedAt` from `Date` to ISO strings before returning.
- `Post.image` and `Draft.image` are optional strings (stored as DataURL from file input).

### Pages and rendering strategy

- `app/page.tsx` and `app/post/[id]/page.tsx` use `export const revalidate = 0` (ISR — cache forever, invalidated by `revalidatePath`).
- `app/write/page.tsx` and `app/settings/categories/page.tsx` use `export const dynamic = 'force-dynamic'` (always fresh — these pages must reflect the latest draft/categories on every visit).
- `app/post/[id]/page.tsx` uses `React.cache()` to deduplicate the `postService.getById` call between `generateMetadata` and the page component.
- `app/login/page.tsx` uses `auth()` to redirect already-authenticated users to `/`.

### Authentication & Authorization

**Single-admin model** — public read, admin-only write. No user table or sign-up UI.

#### How it works

1. **`src/proxy.ts`** (Auth.js Edge proxy) — 1st layer:
   - Protected pages (`/write`, `/settings/**`) → redirect to `/login?callbackUrl=...` if unauthenticated
   - Mutation API methods (POST/PUT/DELETE/PATCH on `/api/**`) → 401 JSON if unauthenticated
   - GET requests always pass through (public reads)

2. **`src/lib/auth.ts`** helpers — 2nd layer (Defense-in-depth):
   - `requireAdminPage()`: used in Server Actions — calls `auth()`, redirects to `/login` if no session
   - `requireAdminApi()`: used in API Routes — calls `auth()`, returns 401 Response if no session

3. **`src/auth.ts`** — Auth.js v5 core config:
   - Credentials provider: validates `ADMIN_USERNAME` + `bcrypt.compare(password, ADMIN_PASSWORD_HASH)`
   - JWT session strategy (7-day maxAge), no DB session table
   - `role: "admin"` injected into JWT and Session via callbacks

#### Session-aware UI

`Header.tsx` is an async Server Component that calls `auth()` and renders:
- **Admin**: "카테고리" · "새 글" · "로그아웃" (LogoutButton client component)
- **Guest**: "로그인" link

#### Environment variables required

```
AUTH_SECRET=<random 32+ bytes, base64>        # JWT signing secret
ADMIN_USERNAME=rudy                            # Admin login ID
ADMIN_PASSWORD_HASH=<bcrypt hash, cost=12>     # Never store plaintext password
```

#### proxy.ts naming

Next.js 16.2 deprecated `middleware.ts` in favor of `proxy.ts`. The Auth.js `auth()` wrapper works identically in both. Do **not** rename back to `middleware.ts`.

### API Routes

All routes use `apiSuccess` / `apiError` / `handleError` from `lib/api.ts` for consistent JSON responses:
- Success: `{ data: ... }` with appropriate 2xx status
- Error: `{ error: { code, message } }` with appropriate 4xx/5xx status

Error mapping in `handleError`:
- `NotFoundError` → 404
- `ConflictError` → 409
- `ValidationError` → 400
- `UNAUTHORIZED` → 401 (returned directly by proxy.ts or requireAdminApi)
- Other → 500

### Server Actions

Only `createPost` and `deletePost` remain in `lib/actions/posts.ts`. These use `redirect()` from `next/navigation` which requires a Server Action context — `redirect()` cannot be used inside an API Route Handler. Both call `requireAdminPage()` as the first line.

All other mutations (update post, save/delete draft, add/delete category) use API Route Handlers because they need to return data or don't require a page redirect.

### Milkdown editor

`MilkdownEditor` must be loaded with `next/dynamic` and `{ ssr: false }`. Its CSS (`@milkdown/crepe/theme/common/style.css` and `frame.css`) is imported **inside the component file**, not in `globals.css` — Turbopack resolves package-relative CSS from JS module context reliably.

The editor mounts via `useEffect`. Cleanup must call both `crepe.destroy()` and `container.innerHTML = ''` to handle React StrictMode double-mount.

The `key` prop on the editor in `WriteForm` forces a remount when switching contexts, since `defaultValue` is only read at mount time.

`globals.css` contains Milkdown overrides: `.milkdown-wrap .ProseMirror` (padding/min-height), `.milkdown-readonly` (read-only mode), and hides block handles via `display: none !important`.

### Draft auto-save

`WriteForm` auto-saves via `fetch('PUT /api/draft')` with a **2-second debounce** on every field change. On submit, `fetch('DELETE /api/draft')` is called before `createPost` Server Action.

`PostDetail` (edit mode) does **not** use Draft — it calls `fetch('PUT /api/posts/:id')` directly and refreshes via `router.refresh()`.

### Styling

Tailwind v4 — `globals.css` uses `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`. No `tailwind.config.js`. Typography plugin activated via `prose` classes on post content.

### Docker deployment

`next.config.ts` sets `output: 'standalone'`. Docker config lives in `docker/` directory:
- `docker/docker-compose.yml`: postgresql + app services. App service uses `env_file: .env` + explicit `environment` entries for auth vars.
- `docker/.env.example`: template for all required variables (copy to `docker/.env` before running).

On container startup, `prisma migrate deploy` runs before `node server.js`.

### Prisma version constraint

Prisma **v5** is required. Do not upgrade to v7 — v7 removed `url = env("DATABASE_URL")` from the datasource block and breaks the configuration.
