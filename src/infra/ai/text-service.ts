import { generateText } from "ai";
import { googleAI } from "../google/ai";
import { promptForTextData } from "../prompt";
import { env } from "../env";

type TextServiceData = {
  description: string;
};

type TextServiceResponse = {
  generatedTitle: string;
  generatedDescription: string;
  generatedMetaDescription: string;
  generatedTags: string[];
};

export class TextService {
  async execute({ description }: TextServiceData): Promise<TextServiceResponse> {
    const { text } = await generateText({
      model: googleAI(env.AI_TEXT_MODEL),
      prompt: promptForTextData(description),
    });

    const generatedListingText = text
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?$/g, "");

    const result = JSON.parse(generatedListingText) as TextServiceResponse;

    return result;
  }
}
