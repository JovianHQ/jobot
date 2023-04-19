import Navbar from "@/components/Navbar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const router = useRouter();

  const supabase = useSupabaseClient();

  async function sendCode() {
    console.log("email entered:", email);
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
      console.log("Verification code sent");
    }
  }

  async function submitCode() {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: "magiclink",
    });

    if (data?.user) {
      toast.success("Signed in successfully");
      console.log("Signed in succesfully", data);
      router.push("/");
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
        console.log("signed up sucessfully", d2);
        router.push("/");
      }
      if (e2) {
        toast.error("Failed to sign in / sign up");
        console.error("sign up failed", e2);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Jobot - Your friendly neighborhood AI</title>
      </Head>
      <Toaster />
      <div className="flex flex-col h-screen">
        {/* Navigation Bar */}
        <Navbar />
        <div className="mx-auto max-w-md">
          <div className="border self-center rounded-lg my-8 p-4 m-4">
            <div className="text-center text-xl font-bold text-gray-800">
              Log In - Jobot
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="border p-2 rounded-md mt-1"
                placeholder="john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-40 border text-sm font-medium px-4 py-2 mt-2 rounded-md bg-gray-50 hover:bg-gray-100"
                onClick={sendCode}
              >
                Send Code
              </button>
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">
                Verification Code
              </label>
              <input
                type="password"
                className="border p-2 rounded-md mt-1"
                placeholder="123456"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
              <button
                onClick={submitCode}
                className="w-40 border border-blue-600 text-sm font-medium px-4 py-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Sign In
              </button>
            </div>

            <p className="text-gray-600 text-sm prose">
              {"By signing in, you agree to our "}
              <Link href="/terms">terms of use</Link>
              {" and "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
