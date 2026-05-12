import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload/upload-and-persist-image/upload-and-persist-image";
import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse } from "../../../core/infra/http-response";
import { z, ZodError } from "zod";

const uploadAndPersistImageControllerRequest = z.object({
  file: z
    .custom<Express.Multer.File>((file) => !!file, {
      message: "Nenhuma imagem foi anexada.",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype), {
      message: "Invalid file type",
    }),
});

type UploadAndPersistImageControllerRequest = z.infer<typeof uploadAndPersistImageControllerRequest>;

export class UploadAndPersistImageController implements Controller {
  constructor(private uploadAndPersistImage: UploadAndPersistImageUseCase) {}

  async handle(request: UploadAndPersistImageControllerRequest): Promise<HttpResponse> {
    try {
      const { file } = uploadAndPersistImageControllerRequest.parse({
        file: request.file,
      });

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
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      return fail(new Error(String(err)));
    }
  }
}
