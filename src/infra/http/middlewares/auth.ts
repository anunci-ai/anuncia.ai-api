import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { env } from "../../env";

interface Payload {
  sub: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: Payload;
  }
}

export async function auth(request: Request, reply: Response, next: NextFunction) {
  const authHeader = request.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return reply.status(401).json({ message: "Token is missing!" });
  }

  try {
    const payload = verify(token, env.JWT_SECRET) as Payload;
    const usersRepository = new PrismaUsersRepository();

    const user = await usersRepository.findById(payload.sub);

    if (!user) {
      return reply.status(401).json({ message: "Usuário não encontrado." });
    }

    request.user = payload;
    next();
  } catch (error) {
    return reply.status(500).json({ error });
  }
}
