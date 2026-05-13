import { fal, ApiError, ValidationError } from "@fal-ai/client";
import { env } from "../env";
import { InvalidFileTypeError } from "../../domain/application/use-cases/_errors/invalid-file-type-error";
import { ImageGenerationFailedError } from "../../domain/application/use-cases/_errors/image-generation-failed-error";
import { isValidImageType } from "../../domain/enterprise/validators/is-valid-image-type";

fal.config({ credentials: env.FAL_KEY });

const FAL_MODEL = "fal-ai/nano-banana/edit";
const MAX_INPUT_SIZE_BYTES = 10 * 1024 * 1024;
const STAGE_TIMEOUT_MS = 90_000;

const BASE_PROMPT =
  "Professional e-commerce product photograph of the item shown in the reference image. " +
  "Pure white seamless background (#FFFFFF), soft even studio lighting, sharp focus, " +
  "no shadows on the floor other than a subtle contact shadow under the product, " +
  "no text, no watermark, no logos overlaid on the image, no people, no props. " +
  "Preserve the product's exact colors, shape, materials, and any branding printed on the product itself.";

const ANGLE_PROMPTS = [
  `${BASE_PROMPT} Camera angle: straight-on front view at eye level, product centered.`,
  `${BASE_PROMPT} Camera angle: three-quarter view, camera rotated about 45 degrees to the right of the product, eye level.`,
  `${BASE_PROMPT} Camera angle: full side profile, camera 90 degrees to the right of the product, eye level.`,
] as const;

type ImageServiceInput = {
  inputImageUrl: string;
};

type ImageServiceResponse = {
  urls: string[];
};

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new ImageGenerationFailedError("Tempo limite de geração de imagens excedido.")),
        STAGE_TIMEOUT_MS,
      ),
    ),
  ]);
}

async function validateInputUrl(url: string): Promise<void> {
  let head: Response;

  try {
    head = await fetch(url, { method: "HEAD" });
  } catch {
    throw new ImageGenerationFailedError("Não foi possível acessar a imagem original.");
  }

  if (!head.ok) {
    throw new ImageGenerationFailedError("Imagem original inacessível.");
  }

  const contentType = head.headers.get("content-type") ?? "";

  if (!isValidImageType(contentType.split(";")[0].trim())) {
    throw new InvalidFileTypeError();
  }

  const contentLength = head.headers.get("content-length");

  if (contentLength && parseInt(contentLength, 10) > MAX_INPUT_SIZE_BYTES) {
    throw new ImageGenerationFailedError("Imagem original excede o tamanho máximo de 10 MB.");
  }
}

export class ImageService {
  async execute({ inputImageUrl }: ImageServiceInput): Promise<ImageServiceResponse> {
    await validateInputUrl(inputImageUrl);

    try {
      const urls = await Promise.all(ANGLE_PROMPTS.map((prompt) => this.generateView(inputImageUrl, prompt)));

      return { urls };
    } catch (error) {
      if (error instanceof InvalidFileTypeError || error instanceof ImageGenerationFailedError) {
        throw error;
      }

      if (error instanceof ValidationError) {
        throw new ImageGenerationFailedError(`Parâmetros inválidos: ${error.message}`);
      }

      if (error instanceof ApiError) {
        throw new ImageGenerationFailedError(`Falha na API fal.ai: ${error.message}`);
      }

      throw new ImageGenerationFailedError();
    }
  }

  private async generateView(url: string, prompt: string): Promise<string> {
    const result = await withTimeout(
      fal.subscribe(FAL_MODEL, {
        input: {
          prompt,
          image_urls: [url],
          num_images: 1,
          output_format: "png",
        },
        logs: false,
      }),
    );

    return (result.data as { images: { url: string }[] }).images[0].url;
  }
}
