import { Request, Response } from "express";
import { z } from "zod";
import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";

const uploadImageBodySchema = z.object({
  marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
  shortDescription: z.string().min(1, "A descrição curta é obrigatória."),
});

export class UploadAndPersistImageController {
  constructor(private uploadAndPersistImage: UploadAndPersistImageUseCase) {}

  async handle(request: Request, response: Response) {
    try {
      const { marketplace, shortDescription } = uploadImageBodySchema.parse(request.body);

      const file = request.file;

      if (!file) {
        return response.status(400).json({ message: "Arquivo de imagem não enviado." });
      }

      const userId = request.user!.sub;

      const result = await this.uploadAndPersistImage.execute({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
        marketplace,
        shortDescription,
      });

      if (result.isLeft()) {
        const error = result.value;
        return response.status(400).json({ message: error.message });
      }

      return response.status(201).json({
        message: "Upload realizado e anúncio em processamento!",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({ message: "Dados inválidos", errors: error.format() });
      }
      return response.status(500).json({ message: "Erro interno no servidor." });
    }
  }
}
