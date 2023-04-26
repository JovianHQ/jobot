import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";

export const TEMPLATES_BASE_URL =
  "https://raw.githubusercontent.com/JovianHQ/jobot/main/templates";

export async function getTemplates() {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/index.json?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return await res.json();
}

export async function getSystemPrompt(slug) {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/${slug}/system.md?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return res.text();
}

export async function getUserPrompt(slug) {
  const res = await fetch(
    `${TEMPLATES_BASE_URL}/${slug}/user.md?t=${new Date().getTime()}`,
    {
      cache: "no-store",
    }
  );
  return res.text();
}

export async function getTemplate(slug) {
  const [templates, systemPrompt, userPrompt] = await Promise.all([
    getTemplates(),
    getSystemPrompt(slug),
    getUserPrompt(slug),
  ]);

  const template = templates.find((t) => t.slug === slug);

  if (!template) {
    return null;
  }

  template.systemPrompt = systemPrompt;
  template.userPrompt = userPrompt;

  return template;
}

export async function fetchUserProfile(supabase, user) {
  if (!user) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error while fetch user profile", error);
  }
}

export async function updateUserProfile(supabase, profileData) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", profileData.id);

    if (error) {
      throw error;
    }

    toast.success("Profile updated!");
    return true;
  } catch (e) {
    toast.error("Failed to update profile");
    console.error("Failed to update profile", e);
  }
}

export async function verifyServerSideAuth(req, res) {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const possibleKey = authHeader.substring(7);

    const { data: apiKey, error: err2 } = await supabase
      .from("apikeys")
      .select("*")
      .eq("key", possibleKey)
      .single();

    if (err2 || !apiKey) {
      console.error("Failed to validate API key", err2);
    } else {
      return true;
    }
  }

  const {
    data: { user },
    error: err1,
  } = await supabase.auth.getUser();

  if (err1 || !user) {
    console.error("Failed to get current user", err1);
  } else {
    return true;
  }

  return false;
}

export function getChatResponseHeaders() {
  return {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Referer, Authorization, API_URL",
  };
}
