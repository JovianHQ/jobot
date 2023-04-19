import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut().then(() => {
      router.push("/");
    });
  }, [supabase, router]);

  return <div></div>;
}
