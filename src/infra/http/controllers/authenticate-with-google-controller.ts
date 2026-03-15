import { Request, Response } from "express";
import { z } from "zod";
import { AuthenticateWithGoogleUseCase } from "../../../domain/application/use-cases/authenticate-with-google";

export class AuthenticateWithGoogleController {
  constructor(private authenticateWithGoogleUseCase: AuthenticateWithGoogleUseCase) {}

  async handle(request: Request, response: Response) {
    const authenticateBodySchema = z.object({
      idToken: z.string({ required_error: "O idToken do Google é obrigatório." }),
    });

    try {
      const { idToken } = authenticateBodySchema.parse(request.body);

      const result = await this.authenticateWithGoogleUseCase.execute({
        idToken,
      });

      if (result.isLeft()) {
        const error = result.value;
        return response.status(401).json({ message: error.message });
      }

      const { token } = result.value;

      return response.status(200).json({ token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ message: "Dados inválidos", errors: error.format() });
      }
      return response.status(500).json({ message: "Erro interno do servidor." });
    }
  }
}
