import "dotenv/config";
import cors from "cors";
import express from "express";
import { apiReference } from "@scalar/express-api-reference";
import { routes } from "./routes";
import { env } from "../env";
import { openapiDocument } from "./docs/openapi";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/v1", routes);

if (env.NODE_ENV !== "production") {
  app.get("/openapi.json", (_, res) => res.json(openapiDocument));
  app.use("/docs", apiReference({ url: "/openapi.json", theme: "default" }));
}

app.get("/", (request, response) => {
  return response.json({
    status: "ok",
    service: "ANUNCIA.AI API",
    version: "1.0.0",
    environment: env.NODE_ENV,
    uptime: new Date(),
  });
});

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
