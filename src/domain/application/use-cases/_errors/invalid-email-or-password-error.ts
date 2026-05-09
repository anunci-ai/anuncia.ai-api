import { UseCaseError } from "../../../../core/errors/use-case-error";

export class InvalidEmailOrPasswordError extends Error implements UseCaseError {
  constructor() {
    super("E-mail ou senha incorreto.");
    this.name = "InvalidEmailOrPasswordError";
  }
}
