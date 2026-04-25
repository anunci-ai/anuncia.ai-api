import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";
import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse } from "../../../core/infra/http-response";

// Tipagem do objeto limpo que o Adapter vai enviar para nós
type UploadRequest = {
  file?: Express.Multer.File;
};

export class UploadAndPersistImageController implements Controller {
  constructor(private uploadAndPersistImage: UploadAndPersistImageUseCase) {}

  async handle(request: UploadRequest): Promise<HttpResponse> {
    try {
      const file = request.file;

      if (!file) {
        return clientError("Arquivo de imagem não enviado.");
      }

      const result = await this.uploadAndPersistImage.execute({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      });

      if (result.isLeft()) {
        const error = result.value;
        return clientError(error.message);
      }
      const { url } = result.value;

      return created({ url });
    } catch (error) {
      return fail(new Error(String(error)));
    }
  }
}
