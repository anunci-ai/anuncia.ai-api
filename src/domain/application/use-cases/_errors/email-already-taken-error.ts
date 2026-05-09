import { UseCaseError } from "../../../../core/errors/use-case-error";

export class EmailAlreadyTakenError extends Error implements UseCaseError {
  constructor() {
    super("E-mail já está em uso.");
    this.name = "EmailAlreadyTakenError";
  }
}
