import { toast } from "react-hot-toast";
import { createClient } from "@supabase/supabase-js";

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

export async function verifyServerSideAuth(supabase, headers) {

  let authHeader;

  try {
    authHeader = headers.get('authorization');
  } catch (e) {
    try {
      authHeader = headers['authorization'];
    } catch (e2) {
      console.log("header not found")
    }
  }

  if (authHeader) {
    const supabaseService = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const possibleKey = authHeader.substring(7);

    const { data: apiKey, error: err2 } = await supabaseService
      .from("apikeys")
      .select("*, profile: profiles(*)")
      .eq("key", possibleKey)
      .single();

    if (err2 || !apiKey) {
      console.error("Failed to validate API key", err2);
    } else {
      return apiKey.profile;
    }
  } else {
    const {
      data: { user },
      error: err1,
    } = await supabase.auth.getUser();

    if (err1 || !user) {
      console.error("Failed to get current user", err1);
    } else {
      return user;
    }
  }
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

export async function ensureUserProfile(supabase, user) {
  let userProfile = await fetchUserProfile(supabase, user);

  if (!userProfile) {
    let username;
    if (user.email) {
      const email = user.email;
      username = email.split("@")[0];
    } else if (user.phone) {
      username = user.phone;
    } else {
      username = user.id;
    }

    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          username: username,
          first_name: username,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return profile;
    } catch (e) {
      console.error("Error while creating profile", e);
      return false;
    }
  } else {
    return true;
  }
}

export async function sendVerificationCode(supabase, email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
  });

  if (error) {
    toast.error("Failed to send verfication code");
    console.error("Failed to send verification code", error);
    return;
  }
  if (data) {
    toast.success("Verification code send. Check your email!");
  }
}

export async function submitVerificationCode(supabase, email, code) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: code,
    type: "magiclink",
  });

  if (data?.user) {
    toast.success("Signed in successfully");
    return ensureUserProfile(supabase, data.user);
  }

  if (error) {
    console.error("Failed to sign in", error);

    const { data: d2, error: e2 } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "signup",
    });

    if (d2.user) {
      toast.success("Signed up successfully");
      return ensureUserProfile(supabase, d2.user);
    }
    if (e2) {
      toast.error("Failed to sign in / sign up");
      console.error("sign up failed", e2);
    }
  }
}
