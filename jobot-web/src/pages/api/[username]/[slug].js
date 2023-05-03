import { fillTemplate } from "@/components/SkillForm";
import { getChatResponseHeaders, verifyServerSideAuth } from "@/network";
import { OpenAIStream } from "@/utils/openai";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const config = {
  runtime: "edge",
};

const SYSTEM_MESSAGE =
  "You are Jobot, a helpful and verstaile AI created by Jovian using state-of the art ML models and APIs.";

export default async function handler(req, res) {
  const url = new URL(req.url);

  const username = url.pathname.split("/")[2];
  const slug = url.pathname.split("/")[3];

  const supabase = createMiddlewareSupabaseClient({ req, res });
  const authenticated = await verifyServerSideAuth(supabase, req.headers);

  const headers = getChatResponseHeaders();

  if (!authenticated) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*,profile:profiles(username, first_name, last_name)")
    .eq("slug", slug)
    .eq("profiles.username", username)
    .limit(1);

  if (error || skills?.length < 1) {
    return new Response("Skill not found", { status: 404, headers });
  }

  const skill = skills[0];

  if (req.method === "GET") {
    headers["content-type"] = "application/json";
    return new Response(JSON.stringify({ skill: skill }), {
      headers,
      status: 200,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not supported", { status: 405, headers });
  }

  const body = await req.json();
  body.model = "gpt-3.5-turbo";

  const inputData = body.inputData;

  const filledMessages = [
    { role: "system", content: SYSTEM_MESSAGE },
    { role: "system", content: fillTemplate(skill.system_prompt, inputData) },
    { role: "user", content: fillTemplate(skill.user_prompt, inputData) },
  ];

  body.messages = [...filledMessages, ...(body.messages || [])];

  delete body.inputData;

  if (body.stream) {
    const stream = await OpenAIStream(body);
    return new Response(stream, { status: 200, headers });
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    });
    const resText = await res.text();
    headers["Content-Type"] = "application/json";
    return new Response(resText, { status: 200, headers });
  }
}
