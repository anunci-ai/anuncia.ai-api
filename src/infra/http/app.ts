import "dotenv/config";
import cors from "cors";
import express from "express";
import { routes } from "./routes";
import { auth } from "./middlewares/auth";
import { env } from "../env";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/v1", routes);

app.get("/", (request, response) => {
  return response.json({
    status: "ok",
    service: "ANUNCIA.AI API",
    version: "1.0.0",
    environment: env.NODE_ENV,
    uptime: new Date(),
  });
});

// TEST
app.get("/v1/hello", auth, (request, response) => {
  return response.json({ message: `Dmitri é gay.` });
});

const port = env.PORT;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
