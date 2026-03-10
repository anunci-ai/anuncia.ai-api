import type { Request, Response } from "express";
import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";
import { z } from "zod";

export class SignInWithPasswordController {
  constructor(private signInWithPasswordUseCase: SignInWithPasswordUseCase) {}

  async handle(request: Request, response: Response) {
    const signInWithPasswordBodySchema = z.object({
      email: z.email({ message: "E-mail inválido" }),
      password: z.string().min(8, { message: "Senha deve ter no mínimo 8 caracteres." }),
    });

    const { email, password } = signInWithPasswordBodySchema.parse(request.body);

    const { token } = await this.signInWithPasswordUseCase.execute({ email, password });

    return response.status(201).json({ token });
  }
}
