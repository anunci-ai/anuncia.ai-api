# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
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
```

## Architecture

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
```

### Key patterns

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
