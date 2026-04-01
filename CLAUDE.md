# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (requires PostgreSQL running)
npm run dev

# Build
npm run build

# Lint
npm run lint

# Prisma: apply migrations to local DB
npx prisma migrate dev --name <migration-name>

# Prisma: regenerate client after schema changes
npx prisma generate

# Prisma: open DB browser
npx prisma studio

# Docker: build and run full stack
docker compose up --build -d

# Docker: stop
docker compose down
```

`.env.local` must contain `DATABASE_URL=postgresql://...` for local development.

## Architecture

**Stack**: Next.js 16.2 App Router · React 19 · Tailwind CSS v4 · Prisma v5 · PostgreSQL · `@milkdown/crepe` v7

### Data model
Three Prisma models: `Post`, `Draft`, `Category`.

- `Post.category` stores the category **name as a plain string** (not a FK). When a `Category` is deleted, posts are updated to `category = ""` via `prisma.post.updateMany`.
- `Draft` is a **single-row table** with a hardcoded `id = "draft"`. Saved via `upsert`, deleted via `deleteMany`. Only used during new post creation (not editing).
- `Post.tags` and `Draft.tags` are `String[]` (Postgres array). After fetching from Prisma, `createdAt`/`updatedAt` must be converted to ISO strings before passing to client components.

### Pages and data flow
All DB-fetching pages require `export const dynamic = 'force-dynamic'` to prevent static rendering failures at build time.

Filtering (search/category/tag) is done **client-side** in `PostFeed`: all posts are loaded server-side on the home page, then filtered in-memory via `useMemo`. This is intentional for a personal blog scale.

### Server Actions
Located in `src/lib/actions/`. Each action calls `revalidatePath('/')` and uses `redirect()` from `next/navigation` — do not return values from these functions.

### Milkdown editor
`MilkdownEditor` (`src/components/editor/MilkdownEditor.tsx`) must be loaded with `next/dynamic` and `{ ssr: false }`. Its CSS (`@milkdown/crepe/theme/common/style.css` and `frame.css`) is imported **inside the component file**, not in `globals.css` — the Turbopack bundler resolves package-relative CSS imports reliably from JS module context but not from CSS `@import` chains.

The editor mounts via `useEffect` and the cleanup must call both `crepe.destroy()` and `container.innerHTML = ''` to handle React StrictMode's double-mount.

The editor `key` prop in `WriteForm` (`key={postId ?? 'new'}`) forces a remount when switching between new-post and edit-post views, since `defaultValue` is only read at mount time.

### Styling
Tailwind v4 syntax — `globals.css` uses `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"`. There is no `tailwind.config.js`. The typography plugin is activated via `prose` classes on `PostContent`.

### Docker deployment
`next.config.ts` sets `output: 'standalone'`. The Dockerfile copies the standalone output plus Prisma binaries from `node_modules/.prisma`, `node_modules/@prisma`, and `node_modules/prisma`. On container startup, `prisma migrate deploy` runs before `node server.js`.

### Prisma version constraint
Prisma **v5** is required. Prisma v7 removed `url = env("DATABASE_URL")` from the schema datasource block and broke the configuration. Do not upgrade to v7.
