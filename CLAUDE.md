# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
<<<<<<< HEAD
npm run dev          # Start dev server with hot reload (tsx --watch)
npm test             # Run all tests with Vitest
npm test -- --run    # Run tests once (no watch mode)
npx vitest run src/path/to/file.spec.ts  # Run a single test file
npm run db:seed      # Seed the database
npx prisma migrate dev   # Create and apply a migration
npx prisma studio        # Open Prisma Studio UI
```

Local Postgres (Docker):
```bash
docker compose up -d
=======
# Development
npm run dev          # tsx --watch src/infra/http/app.ts

# Testing
npm test             # vitest (watch mode)
npx vitest run       # single run
npx vitest run src/path/to/file.spec.ts  # single test file

# Database
docker-compose up -d                         # start local PostgreSQL
npx prisma migrate dev --name <migration>    # create and apply migration
npx prisma generate                          # regenerate Prisma client after schema changes
npx prisma studio                            # browse data

# Linting / formatting (run automatically via pre-commit hook)
npx eslint .
npx prettier --write .
>>>>>>> dc4acf5 (feat(listings): add image generation pipeline via fal.ai Nano Banana)
```

## Architecture

<<<<<<< HEAD
This is a **Clean Architecture / DDD** Node.js + Express API for AI-powered product listing generation.

### Layer structure

```
src/
├── core/           # Framework-agnostic utilities shared across layers
│   ├── either.ts   # Either<L, R> monad: Left = error, Right = success
│   ├── entities/   # Base Entity class, UniqueEntityId
│   ├── infra/      # Controller interface, HttpResponse, express-route-adapter
│   └── repositories/  # Shared repo interfaces (pagination, profile)
├── domain/
│   ├── enterprise/entities/   # Domain entities (User, Listing, Subscription, Plan, …)
│   ├── enterprise/mappers/    # Prisma ↔ domain entity conversions
│   ├── application/
│   │   ├── use-cases/         # One folder per use case: DTO, Response, implementation
│   │   ├── repositories/      # Repository interfaces (contracts)
│   │   ├── queue/             # Queue service interface
│   │   └── storage/           # Storage uploader interface
└── infra/
    ├── http/
    │   ├── app.ts             # Express app entry point, port 8080
    │   ├── routes/            # Route wiring (auth, listings, uploads, subscriptions)
    │   ├── controllers/       # Controller implementations
    │   ├── factories/         # make*Controller() — DI wiring, one per controller
    │   ├── middlewares/auth.ts # JWT auth middleware; injects request.user.sub
    │   └── multer/            # Multer config for file uploads
    ├── prisma/
    │   ├── index.ts           # Prisma client singleton
    │   └── repositories/      # Prisma repository implementations
    ├── ai/                    # AI service wrappers (text, image via Google Gemini)
    ├── google/                # Google OAuth client
    ├── qstash/                # Upstash QStash client & service implementation
    ├── storage/               # Cloudflare R2 (S3-compatible) client & uploader
    ├── env.ts                 # Zod-validated env schema (fail-fast on startup)
    └── prompt.ts              # AI prompt templates
=======
This project follows **Clean Architecture / DDD** with strict layer separation. Dependencies always point inward.

### Layer overview

```
src/core/           — shared primitives (no business logic)
src/domain/         — all business logic, zero infra imports
  enterprise/       — entities, value objects, mappers
  application/      — use cases, DTOs, repository interfaces, queue/storage abstractions
src/infra/          — concrete implementations of everything in domain/application
  http/             — Express app, controllers, routes, factories, middlewares
  prisma/           — DB client + repository implementations
  ai/               — Gemini (text) + fal.ai (image-to-image)
  storage/          — Cloudflare R2 via AWS S3 SDK
  qstash/           — Upstash QStash queue service
  google/           — Google OAuth client
test/               — in-memory repository implementations used in unit tests
>>>>>>> dc4acf5 (feat(listings): add image generation pipeline via fal.ai Nano Banana)
```

### Key patterns

<<<<<<< HEAD
**Either monad** — all use cases return `Either<ErrorType, ResponseType>`. Use `left(new SomeError())` for failures and `right(value)` for success. Never throw from use cases.

**Controller → Use Case flow:**
1. Route calls `adaptRoute(makeXController())` — the factory does manual DI
2. `adaptRoute` merges `body + params + query + userId + file` into a flat request object
3. Controller calls use case, maps Either result to HTTP response codes

**Factories** (`src/infra/http/factories/`) wire up concrete Prisma repositories and inject them into use cases. No IoC container — all manual.

**Repository pattern** — domain layer only knows the interface (e.g., `ListingsRepository`). Tests use in-memory implementations from `test/repositories/`.

**Listing lifecycle** — `StatusEnum`: DRAFT → TEXT_PROCESSING → TEXT_COMPLETED → IMAGE_PROCESSING → IMAGE_COMPLETED → COMPLETED / FAILED. Background text/image generation is triggered via QStash jobs; the `/process-text` and `/process-images` routes are worker endpoints (no auth).

**Token consumption** — each listing creation consumes 200 tokens from the user's active `Subscription`. Use cases check `subscription.isActive` and call `subscription.consumeTokens()` before proceeding.

### Environment variables

All required vars are validated by Zod in `src/infra/env.ts` at startup:
`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GOOGLE_CLIENT_ID`, `CLOUDFLARE_*`, `QSTASH_*`, `GEMINI_API_KEY`, `API_URL`, `AI_TEXT_MODEL`, `NODE_ENV`

### Testing

Tests live alongside use cases (`.spec.ts`) and use in-memory repositories from `test/repositories/`. `test/setup.ts` only loads `dotenv/config`. There are no integration or E2E tests yet — all tests are unit-level.
=======
**Either monad** — all use cases return `Either<ErrorType, ResponseType>` (see `src/core/either.ts`). `left()` = failure, `right()` = success. Controllers call `result.isLeft()` to decide the HTTP status code.

**Factory functions** — controllers are assembled in `src/infra/http/factories/make-*.ts`. Each factory `new`s the concrete repository → injects into use case → injects into controller. There is no DI container.

**Route adapter** — `adaptRoute()` in `src/core/infra/adapters/express-route-adapter.ts` bridges Express requests to the `Controller` interface, merging `body`, `params`, `query`, `userId` (from JWT middleware), and `file` (multer) into a single flat object passed to `controller.handle()`.

**Queue workers** — QStash calls back into this same API at `/v1/listings/process-text` and `/v1/listings/process-images`. These routes are intentionally unauthenticated (QStash signs the request instead). The `QueueService` interface in `src/domain/application/queue/` is implemented by `QStashService`.

### Listing lifecycle

`DRAFT → TEXT_PROCESSING → TEXT_COMPLETED → IMAGE_PROCESSING → IMAGE_COMPLETED → COMPLETED`

1. `POST /v1/listings` — creates listing in `DRAFT`
2. `PATCH /v1/listings/generate-text/:id` — sets `TEXT_PROCESSING`, publishes `process-text` job to QStash
3. QStash POSTs `/v1/listings/process-text` — generates title/description/tags/slug via Gemini, sets `TEXT_COMPLETED`
4. `POST /v1/uploads` — uploads original image to Cloudflare R2
5. `POST /v1/listings/generate-images` (in progress) — sets `IMAGE_PROCESSING`, publishes `process-images` job
6. QStash POSTs `/v1/listings/process-images` — runs fal.ai flux image-to-image, saves URLs, sets `COMPLETED`

### Testing approach

Unit tests live next to use cases (`.spec.ts`). They use in-memory repository implementations from `test/repositories/`. Infrastructure (DB, AI, storage, queue) is never called from unit tests.

## Required environment variables

See `src/infra/env.ts` for the full Zod-validated schema. Key groups:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `GOOGLE_CLIENT_ID`
- `CLOUDFLARE_ENDPOINT`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_BUCKET_NAME`, `CLOUDFLARE_PUBLIC_URL`
- `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY`
- `GEMINI_API_KEY`, `AI_TEXT_MODEL`
- `API_URL` — public URL of this API (used by QStash to construct callback URLs)

## Deployment

Deployed on Vercel. `vercel-build` script runs `prisma generate && prisma migrate deploy`. The `vercel.json` configures routing.

## Commit conventions

Commits are linted by `git-commit-msg-linter` (conventional commits). Format: `type(scope): message`. Pre-commit hook runs ESLint + Prettier via lint-staged.
>>>>>>> dc4acf5 (feat(listings): add image generation pipeline via fal.ai Nano Banana)
