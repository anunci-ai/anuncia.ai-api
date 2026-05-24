import * as z from "zod";

export const ErrorResponseSchema = z
  .object({ error: z.string() })
  .meta({ id: "ErrorResponse", description: "Resposta de erro padrão." });

export const AuthErrorResponseSchema = z
  .object({ message: z.string() })
  .meta({ id: "AuthErrorResponse", description: "Resposta de erro do middleware de autenticação." });

export const UserSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    avatarUrl: z.string().nullable().optional(),
    subscription: z
      .object({
        isActive: z.boolean(),
        tokensTotal: z.number().int(),
        tokensRemaining: z.number().int(),
        plan: z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
      })
      .optional(),
  })
  .meta({ id: "User" });

export const ListingSchema = z
  .object({
    id: z.string().uuid(),
    marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
    status: z.enum([
      "DRAFT",
      "TEXT_PROCESSING",
      "TEXT_COMPLETED",
      "IMAGE_PROCESSING",
      "IMAGE_COMPLETED",
      "COMPLETED",
      "FAILED",
    ]),
    inputDescription: z.string(),
    originalImageUrl: z.string().nullable().optional(),
    generatedTitle: z.string().nullable().optional(),
    generatedDescription: z.string().nullable().optional(),
    generatedMetaTitle: z.string().nullable().optional(),
    generatedMetaDescription: z.string().nullable().optional(),
    generatedTags: z.array(z.string()).nullable().optional(),
    generatedSlug: z.string().nullable().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
  })
  .meta({ id: "Listing" });

export const ListingSummarySchema = z
  .object({
    id: z.string().uuid(),
    inputDescription: z.string(),
    marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
    createdAt: z.string().datetime(),
    originalImageUrl: z.string().nullable(),
  })
  .meta({ id: "ListingSummary" });

export const PlanSchema = z
  .object({
    name: z.string(),
    priceInCents: z.number().int().nonnegative(),
    tokensQuantity: z.number().int().positive(),
    createdAt: z.string().datetime().optional(),
  })
  .meta({ id: "Plan" });

export const GeneratedImageSchema = z
  .object({
    id: z.string().uuid(),
    url: z.string().url(),
    createdAt: z.string().datetime(),
  })
  .meta({ id: "GeneratedImage" });

export const AnalyticsSchema = z
  .object({
    listings: z.object({
      total: z.number().int().nonnegative(),
      lastMonth: z.array(
        z.object({
          date: z.string(),
          count: z.number().int().nonnegative(),
        }),
      ),
    }),
  })
  .meta({ id: "Analytics" });
