type OpenAIErrorResponse = { error: { message?: string } };

type OpenAIChatCompletionResponse = {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant" | "user" | "system";
      content: string;
      refusal: string | null;
      annotations: unknown[];
    };
    logprobs: unknown | null;
    finish_reason: "stop" | "length" | "content_filter" | string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details: {
      cached_tokens: number;
      audio_tokens: number;
    };
    completion_tokens_details: {
      reasoning_tokens: number;
      audio_tokens: number;
      accepted_prediction_tokens: number;
      rejected_prediction_tokens: number;
    };
  };
  service_tier: string;
  system_fingerprint: string;
};

type OpenAIResponse = OpenAIChatCompletionResponse | OpenAIErrorResponse;

async function generateDescription(
  estateObject: Record<string, unknown>,
): Promise<{ en: string; ua: string }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key is not set in environment variables");
  }

  const prompt = `
  You are a professional real estate copywriter. Generate an engaging, buyer-focused description for the following property:

  ${JSON.stringify(estateObject, null, 2)}

  Highlight the most important features (price, size, condition, layout, furnishing), nearby amenities, convenience, and motivation to buy or rent. Make it interesting and appealing for potential clients.

  ⚠️ Important: Return plain text only.
  Do NOT use Markdown formatting, asterisks, hashes, or bullet symbols.
  Write it as a natural text paragraph with simple line breaks.

  After writing the English description, add a line with three hyphens (---), and then provide a full, natural translation of the same text into Ukrainian.

  Keep the total output within approximately 1000 tokens.
  `;

  console.log("Waiting for OpenAI response...");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  const data: OpenAIResponse = await response.json();

  if (!response.ok) {
    if ("error" in data) {
      throw new Error(
        data.error.message ?? `Unknown error (status ${response.status})`,
      );
    }
    throw new Error(`Unknown error (status ${response.status})`);
  }

  let content;
  if ("choices" in data) {
    content = data.choices?.[0]?.message?.content?.trim();
  }

  if (!content) {
    throw new Error("No content returned from OpenAI");
  }

  const [enDescription = "", uaDescription = ""] = content
    .split("---")
    .map((s: string) => s.trim());

  return { en: enDescription, ua: uaDescription };
}

export default generateDescription;
