import { generateText } from "ai";
import { googleAI } from "../google/ai";
import { promptForTextData } from "../prompt";

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
      model: googleAI("gemini-2.5-flash"),
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
