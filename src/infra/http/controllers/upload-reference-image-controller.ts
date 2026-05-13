import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse, notFound } from "../../../core/infra/http-response";
import { z, ZodError } from "zod";
import { UploadReferenceImageUseCase } from "../../../domain/application/use-cases/listing/upload-reference-image/upload-reference-image";

const uploadReferenceImageControllerRequest = z.object({
  userId: z.uuid(),
  listingId: z.uuid(),
  file: z
    .custom<Express.Multer.File>((file) => !!file, {
      message: "Nenhuma imagem foi anexada.",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype), {
      message: "Invalid file type",
    }),
});

type UploadReferenceImageControllerRequest = z.infer<typeof uploadReferenceImageControllerRequest>;

export class UploadReferenceImageController implements Controller {
  constructor(private uploadReferenceImageUseCase: UploadReferenceImageUseCase) {}

  async handle(request: UploadReferenceImageControllerRequest): Promise<HttpResponse> {
    try {
      const { userId, listingId, file } = uploadReferenceImageControllerRequest.parse(request);

      if (!file) {
        return clientError("Arquivo de imagem não enviado.");
      }

      const result = await this.uploadReferenceImageUseCase.execute({
        userId,
        listingId,
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      });

      if (result.isLeft()) {
        const error = result.value;
        return notFound(error.message);
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
