import cors from "cors";
import express from "express";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/v1", routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
