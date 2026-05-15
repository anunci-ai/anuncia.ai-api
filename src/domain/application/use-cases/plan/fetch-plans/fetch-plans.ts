import { Either, right } from "../../../../../core/either";
import { PlansToResponseMapper } from "../../../mappers/plans-to-response";
import { PlansRepository } from "../../../repositories/plans-repository";
import { FetchPlansReponse } from "./fetch-plans-response";

export type FetchPlansUseCaseResponse = Either<null, FetchPlansReponse>;

export class FetchPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(): Promise<FetchPlansUseCaseResponse> {
    const plans = await this.plansRepository.findAll();

    return right({
      plans: PlansToResponseMapper.toDTO(plans),
    });
  }
}
