import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { sendVerificationCode, submitVerificationCode } from "@/network";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useLoginDialog } from "@/utils";

export default function LoginModal() {
  const { isLoginOpen, setLoginOpen } = useLoginDialog();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const supabase = useSupabaseClient();

  async function handleSubmit() {
    const success = await submitVerificationCode(supabase, email, code);
    success && setLoginOpen(false);
  }

  return (
    <Transition.Root show={isLoginOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setLoginOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="text-center text-xl font-bold leading-6 text-gray-900"
                >
                  Log In - Jobot
                </Dialog.Title>

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
                    onClick={() => sendVerificationCode(supabase, email)}
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
                    onClick={handleSubmit}
                    className="w-40 border border-blue-600 text-sm font-medium px-4 py-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Sign In
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
