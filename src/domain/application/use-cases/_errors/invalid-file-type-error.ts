export class InvalidFileTypeError extends Error {
  constructor() {
    super("Tipo de arquivo inválido. Apenas imagens são permitidas.");
    this.name = "InvalidFileTypeError";
  }
}
