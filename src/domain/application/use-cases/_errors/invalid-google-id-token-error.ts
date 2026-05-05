export class InvalidGoogleIdTokenError extends Error {
  constructor() {
    super("O token fornecido pelo Google é invalido ou expirou");
    this.name = "InvalidGoogleIdTokenError";
  }
}
