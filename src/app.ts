import express from "express";
import { prisma } from "./prisma";

const app = express();
app.use(express.json());

app.get("/", async (request, response) => {
  const name = "Dimitri";
  const email = "dimitri@example.com";

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return response.json({ user });
});

app.get("/:email", async (request, response) => {
  const { email } = request.params;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return response.json({ user });
});

app.listen(8080, () => {
  console.log("Server is running");
});
