import { z } from "zod";
import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";
import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse } from "../../../core/infra/http-response";

const uploadImageBodySchema = z.object({
  marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
  shortDescription: z.string().min(1, "A descrição curta é obrigatória."),
});

// Tipagem do objeto limpo que o Adapter vai enviar para nós
type UploadRequest = {
  userId: string;
  marketplace: unknown;
  shortDescription: unknown;
  file?: Express.Multer.File;
};

export class UploadAndPersistImageController implements Controller {
  constructor(private uploadAndPersistImage: UploadAndPersistImageUseCase) {}

  async handle(request: UploadRequest): Promise<HttpResponse> {
    try {
      const { marketplace, shortDescription } = uploadImageBodySchema.parse({
        marketplace: request.marketplace,
        shortDescription: request.shortDescription,
      });

      const file = request.file;

      if (!file) {
        return clientError("Arquivo de imagem não enviado.");
      }

      const result = await this.uploadAndPersistImage.execute({
        userId: request.userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
        marketplace,
        shortDescription,
      });

      if (result.isLeft()) {
        const error = result.value;
        return clientError(error.message);
      }

      return created({ message: "Upload realizado e anúncio em processamento!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return clientError({ message: "Dados inválidos", errors: error.format() });
      }
      if (error instanceof Error) {
        return fail(error);
      }
      return fail(new Error(String(error)));
    }
  }
}
