import { UseCaseError } from "../../../../core/errors/use-case-error";

export class InsufficientTokensError extends Error implements UseCaseError {
  constructor() {
    super("Você atingiu o limite de criação de anúncios.");
    this.name = "InsufficientTokensError";
  }
}
