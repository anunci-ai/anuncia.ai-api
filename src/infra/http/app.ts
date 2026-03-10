import cors from "cors";
import express from "express";
import { routes } from "./routes";
import { auth } from "./middlewares/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/v1", routes);

// TEST
app.get("/v1/hello", auth, (request, response) => {
  return response.json({ message: `Dmitri é gay.` });
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
