import { Plan } from "../../enterprise/entities/plan";
import { FetchPlansReponse } from "../use-cases/plan/fetch-plans/fetch-plans-response";

export class PlansToResponseMapper {
  static toDTO(plans: Plan[]): FetchPlansReponse["plans"] {
    return plans.map(({ id, name, priceInCents, tokensQuantity, createdAt }) => ({
      id: id.toString(),
      name,
      priceInCents,
      tokensQuantity,
      createdAt,
    }));
  }
}
