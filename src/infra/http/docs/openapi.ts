import * as z from "zod";
import { createDocument } from "zod-openapi";
import { env } from "../../env";
import {
  AnalyticsSchema,
  AuthErrorResponseSchema,
  ErrorResponseSchema,
  GeneratedImageSchema,
  ListingSchema,
  ListingSummarySchema,
  PlanSchema,
  UserSchema,
} from "./schemas";

const bearerAuth = { bearerAuth: [] };

const responses = {
  400: {
    description: "Dados inválidos.",
    content: { "application/json": { schema: ErrorResponseSchema } },
  },
  401: {
    description: "Token ausente, expirado ou usuário não encontrado.",
    content: { "application/json": { schema: AuthErrorResponseSchema } },
  },
  404: {
    description: "Recurso não encontrado.",
    content: { "application/json": { schema: ErrorResponseSchema } },
  },
  500: {
    description: "Erro interno do servidor.",
    content: { "application/json": { schema: ErrorResponseSchema } },
  },
} as const;

export const openapiDocument = createDocument({
  openapi: "3.1.0",
  info: {
    title: "ANUNCIA.AI API",
    version: "1.0.0",
    description:
      "API para geração de anúncios de e-commerce assistida por IA. Texto via Google Gemini, imagens via fal.ai.",
  },
  servers: [{ url: `http://localhost:${env.PORT}`, description: "Local dev" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtido via `POST /v1/auth/sessions` ou `POST /v1/auth/sessions/google`.",
      },
    },
  },
  tags: [
    { name: "Health", description: "Status da API." },
    { name: "Auth", description: "Autenticação e perfil do usuário." },
    { name: "Listings", description: "Gerenciamento de anúncios." },
    { name: "Uploads", description: "Upload de imagens para o Cloudflare R2." },
    { name: "Subscriptions", description: "Assinaturas de planos." },
    { name: "Plans", description: "Planos disponíveis." },
    { name: "Images", description: "Imagens geradas por IA." },
    { name: "Analytics", description: "Métricas de anúncios." },
    { name: "Internal", description: "Webhooks internos chamados pela Upstash QStash. Não use diretamente." },
  ],
  paths: {
    // ─── Health ───────────────────────────────────────────────
    "/": {
      get: {
        operationId: "healthCheck",
        summary: "Status da API",
        tags: ["Health"],
        security: [],
        responses: {
          "200": {
            description: "API operacional.",
            content: {
              "application/json": {
                schema: z.object({
                  status: z.string().meta({ example: "ok" }),
                  service: z.string().meta({ example: "ANUNCIA.AI API" }),
                  version: z.string().meta({ example: "1.0.0" }),
                  environment: z.string().meta({ example: "development" }),
                  uptime: z.string().datetime(),
                }),
              },
            },
          },
        },
      },
    },

    // ─── Auth ─────────────────────────────────────────────────
    "/v1/auth/sign-up": {
      post: {
        operationId: "signUp",
        summary: "Cadastrar usuário",
        tags: ["Auth"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                name: z.string().meta({ example: "João Silva" }),
                email: z.string().email().meta({ example: "joao@email.com" }),
                password: z.string().min(6).meta({ example: "senha123" }),
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado com sucesso.",
            content: {
              "application/json": {
                schema: z.object({ userId: z.string().uuid() }),
              },
            },
          },
          "400": responses[400],
          "409": {
            description: "E-mail já está em uso.",
            content: { "application/json": { schema: ErrorResponseSchema } },
          },
          "500": responses[500],
        },
      },
    },

    "/v1/auth/sessions": {
      post: {
        operationId: "signInWithPassword",
        summary: "Login com e-mail e senha",
        tags: ["Auth"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                email: z.string().email().meta({ example: "joao@email.com" }),
                password: z.string().meta({ example: "senha123" }),
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Login realizado. Retorna o JWT.",
            content: {
              "application/json": {
                schema: z.object({ token: z.string() }),
              },
            },
          },
          "400": responses[400],
          "500": responses[500],
        },
      },
    },

    "/v1/auth/sessions/google": {
      post: {
        operationId: "signInWithGoogle",
        summary: "Login com Google OAuth",
        tags: ["Auth"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                googleIdToken: z.string().meta({ description: "ID Token retornado pelo fluxo OAuth do Google." }),
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Login realizado. Retorna o JWT.",
            content: {
              "application/json": {
                schema: z.object({ token: z.string() }),
              },
            },
          },
          "400": responses[400],
          "401": {
            description: "Token Google inválido ou expirado.",
            content: { "application/json": { schema: ErrorResponseSchema } },
          },
          "500": responses[500],
        },
      },
    },

    "/v1/auth/me": {
      get: {
        operationId: "getProfile",
        summary: "Perfil do usuário autenticado",
        tags: ["Auth"],
        security: [bearerAuth],
        responses: {
          "200": {
            description: "Perfil do usuário com assinatura ativa (se houver).",
            content: { "application/json": { schema: z.object({ user: UserSchema }) } },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    // ─── Listings ─────────────────────────────────────────────
    "/v1/listings": {
      post: {
        operationId: "createListing",
        summary: "Criar anúncio",
        description: "Cria um anúncio em status `DRAFT`. Consome tokens da assinatura ativa.",
        tags: ["Listings"],
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({
                marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]).meta({ example: "MERCADO_LIVRE" }),
                inputDescription: z.string().meta({ example: "Tênis Nike Air Max branco, tamanho 42, usado 2x." }),
              }),
            },
          },
        },
        responses: {
          "200": {
            description: "Anúncio criado com sucesso.",
            content: {
              "application/json": {
                schema: z.object({ listingId: z.string().uuid() }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
      get: {
        operationId: "fetchRecentListings",
        summary: "Listar anúncios recentes",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          query: z.object({
            page: z.coerce
              .number()
              .int()
              .positive()
              .optional()
              .meta({ description: "Página (padrão: 1).", example: 1 }),
          }),
        },
        responses: {
          "200": {
            description: "Lista de anúncios recentes do usuário.",
            content: {
              "application/json": {
                schema: z.object({ listings: z.array(ListingSummarySchema) }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    "/v1/listings/{listingId}": {
      get: {
        operationId: "getListing",
        summary: "Buscar anúncio",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        responses: {
          "200": {
            description: "Detalhes completos do anúncio.",
            content: { "application/json": { schema: z.object({ listing: ListingSchema }) } },
          },
          "400": responses[400],
          "401": responses[401],
          "404": responses[404],
          "500": responses[500],
        },
      },
      delete: {
        operationId: "deleteListing",
        summary: "Excluir anúncio",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        responses: {
          "204": { description: "Anúncio excluído." },
          "400": responses[400],
          "401": responses[401],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },

    "/v1/listings/{listingId}/upload": {
      patch: {
        operationId: "uploadReferenceImage",
        summary: "Enviar imagem de referência",
        description: "Faz upload da imagem original do produto para o Cloudflare R2 e a associa ao anúncio.",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: z.object({
                image: z
                  .string()
                  .meta({ format: "binary", description: "Imagem do produto (JPEG, PNG ou WebP, máx. 5 MB)." }),
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Upload realizado. Retorna a URL pública da imagem.",
            content: {
              "application/json": {
                schema: z.object({ url: z.string().url() }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },

    "/v1/listings/generate-text/{listingId}": {
      patch: {
        operationId: "generateListingText",
        summary: "Disparar geração de texto",
        description:
          "Publica um job na Upstash QStash para gerar título, descrição, tags e slug via Google Gemini. O status do anúncio passa para `TEXT_PROCESSING`.",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        responses: {
          "202": { description: "Job enfileirado. O processamento ocorre de forma assíncrona." },
          "400": responses[400],
          "401": responses[401],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },

    "/v1/listings/generate-images/{listingId}": {
      patch: {
        operationId: "generateListingImages",
        summary: "Disparar geração de imagens",
        description:
          "Publica um job na Upstash QStash para gerar variações de imagens via fal.ai. O status do anúncio passa para `IMAGE_PROCESSING`. Requer que uma imagem de referência já tenha sido enviada.",
        tags: ["Listings"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        responses: {
          "202": { description: "Job enfileirado. O processamento ocorre de forma assíncrona." },
          "400": responses[400],
          "401": responses[401],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },

    // ─── Uploads ──────────────────────────────────────────────
    "/v1/uploads": {
      post: {
        operationId: "uploadAndPersistImage",
        summary: "Upload de imagem",
        description: "Faz upload de uma imagem para o Cloudflare R2 e retorna a URL pública.",
        tags: ["Uploads"],
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: z.object({
                image: z
                  .string()
                  .meta({ format: "binary", description: "Imagem a ser enviada (JPEG, PNG ou WebP, máx. 5 MB)." }),
              }),
            },
          },
        },
        responses: {
          "201": {
            description: "Upload realizado com sucesso.",
            content: {
              "application/json": {
                schema: z.object({ url: z.string().url() }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    // ─── Subscriptions ────────────────────────────────────────
    "/v1/subscriptions": {
      post: {
        operationId: "subscribeToPlan",
        summary: "Assinar plano",
        tags: ["Subscriptions"],
        security: [bearerAuth],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({ planId: z.string().uuid() }),
            },
          },
        },
        responses: {
          "201": { description: "Assinatura criada com sucesso." },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    "/v1/subscriptions/{subscriptionId}/cancel": {
      patch: {
        operationId: "cancelSubscription",
        summary: "Cancelar assinatura",
        tags: ["Subscriptions"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ subscriptionId: z.string().uuid() }),
        },
        responses: {
          "200": { description: "Assinatura cancelada." },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    // ─── Plans ────────────────────────────────────────────────
    "/v1/plans": {
      get: {
        operationId: "fetchPlans",
        summary: "Listar planos",
        tags: ["Plans"],
        security: [],
        responses: {
          "200": {
            description: "Lista de planos disponíveis.",
            content: {
              "application/json": {
                schema: z.object({ plans: z.array(PlanSchema) }),
              },
            },
          },
          "400": responses[400],
          "500": responses[500],
        },
      },
    },

    // ─── Images ───────────────────────────────────────────────
    "/v1/images/{listingId}": {
      get: {
        operationId: "getGeneratedImages",
        summary: "Listar imagens geradas",
        tags: ["Images"],
        security: [bearerAuth],
        requestParams: {
          path: z.object({ listingId: z.string().uuid() }),
        },
        responses: {
          "200": {
            description: "Imagens geradas por IA para o anúncio.",
            content: {
              "application/json": {
                schema: z.object({ images: z.array(GeneratedImageSchema) }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    // ─── Analytics ────────────────────────────────────────────
    "/v1/analytics": {
      get: {
        operationId: "fetchListingsAnalytics",
        summary: "Métricas de anúncios",
        tags: ["Analytics"],
        security: [bearerAuth],
        responses: {
          "200": {
            description: "Totais e histórico mensal de anúncios do usuário.",
            content: {
              "application/json": {
                schema: z.object({ analytics: AnalyticsSchema }),
              },
            },
          },
          "400": responses[400],
          "401": responses[401],
          "500": responses[500],
        },
      },
    },

    // ─── Internal (QStash workers) ────────────────────────────
    "/v1/listings/process-text": {
      post: {
        operationId: "processListingText",
        summary: "Worker: processar texto",
        servers: [{ url: env.API_URL, description: "QStash callback target (URL pública)" }],
        description:
          "Webhook chamado pela Upstash QStash após `PATCH /v1/listings/generate-text/:listingId`. Gera título, descrição, tags e slug via Google Gemini e atualiza o status para `TEXT_COMPLETED`. **Não chame diretamente** — este endpoint não possui verificação de assinatura QStash.",
        tags: ["Internal"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({ listingId: z.string().uuid() }),
            },
          },
        },
        responses: {
          "200": { description: "Texto gerado e salvo com sucesso." },
          "400": responses[400],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },

    "/v1/listings/process-images": {
      post: {
        operationId: "processListingImages",
        summary: "Worker: processar imagens",
        servers: [{ url: env.API_URL, description: "QStash callback target (URL pública)" }],
        description:
          "Webhook chamado pela Upstash QStash após `PATCH /v1/listings/generate-images/:listingId`. Gera variações de imagem via fal.ai, salva no Cloudflare R2 e atualiza o status para `COMPLETED`. **Não chame diretamente** — este endpoint não possui verificação de assinatura QStash.",
        tags: ["Internal"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: z.object({ listingId: z.string().uuid() }),
            },
          },
        },
        responses: {
          "200": { description: "Imagens geradas e salvas com sucesso." },
          "400": responses[400],
          "404": responses[404],
          "500": responses[500],
        },
      },
    },
  },
});
