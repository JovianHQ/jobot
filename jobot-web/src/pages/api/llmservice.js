import { getChatResponseHeaders } from "@/network";
import { OpenAIStream } from "@/utils/openai";

export const config = {
  runtime: "edge",
};

const defaultOptions = {
  model: "gpt-3.5-turbo",
  max_tokens: 150,
  temperature: 0.9,
};

const createLLMService = ({ openaiApiKey, options = defaultOptions }) => {
  async function chat(body) {
    const fullBody = { ...body, ...options };
    console.log("sending to openai", fullBody);
    if (fullBody.stream) {
      return await OpenAIStream(fullBody, openaiApiKey);
    } else {
      return await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        method: "POST",
        body: JSON.stringify(fullBody),
      });
    }
  }

  return { chat };
};

async function handler(req, res) {
  const body = await req.json();
  const headers = getChatResponseHeaders();
  const llmService = createLLMService({
    openaiApiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const data = await llmService.chat(body);
    return new Response(data, { status: 200, headers });
  } catch (e) {
    return new Response(e.message, { status: 400, headers });
  }
}
export default handler;
