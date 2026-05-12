import { UseCaseError } from "../../../../core/errors/use-case-error";

export class InsufficientTokensError extends Error implements UseCaseError {
  constructor() {
    super("Suas tentativas de anúncios terminaram. Muito obrigado por testar o Anuncia AI");
    this.name = "InsufficientTokensError";
  }
}
