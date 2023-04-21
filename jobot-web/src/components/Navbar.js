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
          {user ? (
            <Link href="/logout" className="text-gray-500 hover:text-blue-600">
              Log Out
            </Link>
          ) : (
            <Link href="/login" className="text-gray-500 hover:text-blue-600">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
