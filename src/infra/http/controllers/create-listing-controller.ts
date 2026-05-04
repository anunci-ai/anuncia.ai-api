import { z, ZodError } from "zod";
import { clientError, fail, ok } from "../../../core/infra/http-response";
import { MarketplaceEnum } from "../../../domain/enterprise/entities/listing";
import { CreateListingUseCase } from "../../../domain/application/use-cases/create-listing";

const generateListingControllerRequest = z.object({
  userId: z.uuid(),
  marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
  inputDescription: z.string(),
});

type GenerateListingControllerRequest = z.infer<typeof generateListingControllerRequest>;

export class CreateListingController {
  constructor(private createListingUseCase: CreateListingUseCase) {}

  async handle(request: GenerateListingControllerRequest) {
    try {
      const { userId, marketplace, inputDescription } = generateListingControllerRequest.parse(request);

      const result = await this.createListingUseCase.execute({
        userId,
        marketplace: marketplace as MarketplaceEnum,
        inputDescription,
      });

      if (result.isLeft()) {
        return clientError();
      }

      return ok(result.value);
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
