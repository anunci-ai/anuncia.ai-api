import { Client } from "@upstash/qstash";
import { env } from "../env";

export const qstash = new Client({
  baseUrl: env.QSTASH_URL,
  token: env.QSTASH_TOKEN,
});
