export type SEOListingData = {
  generatedTitle: string;
  generatedDescription: string;
  generatedMetaDescription: string;
  generatedTags: string[];
};

export function prompt(description: string) {
  return `
    Based on the following product description, generate an SEO-friendly ad optimized for better sales on Google and organic indexing.

    Original description: "${description}"

    Return ONLY a valid JSON with the following structure, without any additional text. All generated content must be in Brazilian Portuguese (pt-BR):

    {
    "generatedTitle": "Título completo e detalhado para SEO (máx 80 caracteres), com palavras-chave de busca, tendências e termos populares",
    "generatedDescription": "Descrição longa e detalhada para conversão (2-3 parágrafos), com benefícios do produto",
    "generatedMetaDescription": "Descrição curta para SEO, com palavras-chave de busca, tendências e termos populares",
    "generatedTags": ["palavra-chave1", "palavra-chave2", "palavra-chave3", "palavra-chave4", "palavra-chave5"]
    }

    Requirements:

    Title must include search keywords, popular terms, and trends
    Description must include an implicit call-to-action
    Tags must be relevant for SEO and search trends
    All returned values must be written in Brazilian Portuguese (pt-BR)
`;
}
