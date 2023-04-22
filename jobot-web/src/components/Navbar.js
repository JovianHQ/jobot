import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const user = useUser();
  return (
    <nav className="shadow px-2 z-40">
      <div className="flex w-full max-w-4xl py-3 items-center justify-between mx-auto">
        <div className="text-2xl font-medium text-gray-800 flex items-center">
          <Link href="/" onClick={() => (window.location = "/")}>
            <Image
              src="/jobot_text_logo.png"
              height={32}
              width={117}
              className="object-contain"
              alt="logo"
              unoptimized
            />
          </Link>
        </div>
        <div>
          <Link
            href="/build"
            className="text-gray-500 hover:text-blue-600 ml-4"
          >
            Build
          </Link>
          <Link
            href="https://github.com/jovianhq/jobot"
            className="text-gray-500 hover:text-blue-600 ml-4"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </Link>
          {user ? (
            <Link
              href="/logout"
              className="text-gray-500 hover:text-blue-600 ml-4"
            >
              Log Out
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-gray-500 hover:text-blue-600 ml-4"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
