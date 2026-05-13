export class ImageGenerationFailedError extends Error {
  constructor(message?: string) {
    super(message ?? "Falha ao gerar imagens.");
    this.name = "ImageGenerationFailedError";
  }
}
