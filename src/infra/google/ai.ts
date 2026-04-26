import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "../env";

export const googleAI = createGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
});
