import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { GetGeneratedImagesUseCase } from "../../../domain/application/use-cases/generated-images/get-generated-images/get-generated-images";

const getGeneratedImagesControllerRequest = z.object({
  userId: z.uuid(),
  listingId: z.uuid(),
});

type GetGeneratedImagesControllerRequest = z.infer<typeof getGeneratedImagesControllerRequest>;

export class GetGeneratedImagesController implements Controller {
  constructor(private getGeneratedImagesUseCase: GetGeneratedImagesUseCase) {}

  async handle(request: GetGeneratedImagesControllerRequest): Promise<HttpResponse> {
    try {
      const { userId, listingId } = getGeneratedImagesControllerRequest.parse(request);

      const result = await this.getGeneratedImagesUseCase.execute({ userId, listingId });

      if (result.isLeft()) {
        return clientError("Erro ao buscar imagens geradas.");
      }

      const { images } = result.value;

      return ok({ images });
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
