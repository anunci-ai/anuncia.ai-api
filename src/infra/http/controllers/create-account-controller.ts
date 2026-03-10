import type { Request, Response } from "express";
import { CreateAccountUseCase } from "../../../domain/application/use-cases/create-account";
import { z } from "zod";

export class CreateAccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handle(request: Request, response: Response) {
    const createAccountBodySchema = z.object({
      name: z.string().min(4, { message: "Nome inválido" }),
      email: z.email({ message: "E-mail inválido" }),
      password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres." }),
    });

    const { name, email, password } = createAccountBodySchema.parse(request.body);

    const { userId } = await this.createAccountUseCase.execute({ name, email, password });

    return response.status(201).json({ userId });
  }
}
