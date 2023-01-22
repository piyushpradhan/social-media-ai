import React, { useRef } from "react";
import { trpc } from "../utils/api";
import { useModalContext } from "../hooks/context/modalContext";
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { IoOpenOutline } from "react-icons/io5";

const NoApiKeyModal = () => {
  const utils = trpc.useContext();
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const modalContext = useModalContext();
  const keyInputRef = useRef<HTMLInputElement>(null);
  const updateApiKeyMutation = trpc.mongo.updateUserApiKey.useMutation({
    onSuccess: async () => {
      await utils.mongo.getUserFromSession.invalidate();
    },
  });

  function updateApiKey() {
    // TODO: Add some validation to check whether the API key is valid
    if (keyInputRef.current && keyInputRef.current.value.trim() !== "") {
      updateApiKeyMutation.mutate({ key: keyInputRef.current?.value });
      modalContext?.setKey(keyInputRef.current?.value);
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center space-y-2 bg-white/90 p-8">
      <div className="relative mx-auto flex w-full max-w-xl flex-col space-x-2 rounded-md border border-black bg-white p-8">
        <div className="flex flex-col items-center text-center md:flex-row">
          {userDetails?.image ? (
            <Image
              className="my-4 rounded-full"
              src={userDetails?.image ?? ""}
              alt="UserProfile"
              loading="lazy"
              width={100}
              height={100}
            />
          ) : (
            <MdAccountCircle size={100} className="my-4 text-black" />
          )}
          <div className="flex w-full flex-col items-start space-y-2 px-4">
            <div className="text-start">
              <p className="text-2xl">
                Hello <span className="font-semibold">{userDetails?.name}</span>
              </p>
              <p>
                It looks like you do not have your API key yet. To get started
                get one from OpenAI and upate it in your profile
              </p>
            </div>
            <input
              type="text"
              defaultValue={userDetails?.key ?? ""}
              placeholder="Enter your API key"
              className="w-full items-center rounded-sm border border-black px-2 py-1 outline-none"
              ref={keyInputRef}
              onSubmit={updateApiKey}
            />
            <div className="mt-2 flex w-full flex-col items-center space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <button
                className="w-full border border-black bg-black px-2 py-1 font-semibold text-white first-letter:rounded-sm"
                onClick={updateApiKey}
              >
                Update
              </button>
              <button className="flex w-full items-center justify-center space-x-2 border border-black px-2 py-1">
                <Link
                  href="https://beta.openai.com/account/api-keys"
                  className="text-center"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Get one
                </Link>
                <IoOpenOutline className="font-semibold text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoApiKeyModal;
