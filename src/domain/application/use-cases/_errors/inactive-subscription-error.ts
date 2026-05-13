import { UseCaseError } from "../../../../core/errors/use-case-error";

export class InactiveSubscriptionError extends Error implements UseCaseError {
  constructor() {
    super("Sua assinatura está inativa.");
    this.name = "InactiveSubscriptionError";
  }
}
