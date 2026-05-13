import { UseCaseError } from "../../../../core/errors/use-case-error";

export class UserAlreadySubscribedError extends Error implements UseCaseError {
  constructor() {
    super("O usuário já possui um plano atrelado à sua conta.");
    this.name = "UserAlreadySubscribedError";
  }
}
