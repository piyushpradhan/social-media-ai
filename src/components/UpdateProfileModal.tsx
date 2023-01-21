import React, {useRef} from "react";
import { trpc } from "../utils/api";
import { useModalContext } from "../hooks/context/modalContext";
import { MdAccountCircle } from "react-icons/md";
import Image from "next/image";

const UpdateProfileModal = () => {
  const userDetails = trpc.mongo.getUserFromSession.useQuery().data;
  const modalContext = useModalContext();
  const keyInputRef = useRef<HTMLInputElement>(null);
  const updateApiKeyMutation = trpc.mongo.updateUserApiKey.useMutation({});


  function closeModal() {
    modalContext?.toggleModal(false);
  }

  function updateApiKey() {
    updateApiKeyMutation.mutate({ key: keyInputRef.current?.value ?? "" });
    modalContext?.toggleModal(false);
  }

  return (
    <div
      className={`
        fixed inset-0 z-10 items-center justify-center bg-white/90 p-8 ${
          modalContext?.modalState.isOpen ? "flex flex-col space-y-2" : "hidden"
        }`}
    >
      <div className="relative mx-auto flex w-full flex-col space-x-2 rounded-md border border-black bg-white p-8">
        <button
          className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer justify-center rounded-md bg-white"
          onClick={closeModal}
          title="Bye bye"
        >
          <span className="select-none text-2xl leading-7">&times;</span>
        </button>

        <div className="flex flex-col items-center text-center">
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
          <h1 className="text-2xl font-semibold">{userDetails?.name ?? ""}</h1>
          <p className="text-sm font-light text-gray-400">
            {userDetails?.email ?? ""}
          </p>

          <label className="pt-4 pb-2 font-medium">Your OpenAI API Key</label>
          <input
            type="text"
            defaultValue={userDetails?.key ?? ""}
            placeholder="Enter your API key"
            className="w-full items-center rounded-sm border border-black px-2 py-1 outline-none"
            ref={keyInputRef}
            onSubmit={updateApiKey}
          />
          <button
            className="mt-1 w-full rounded-sm bg-black px-2 py-1 text-white"
            onClick={updateApiKey}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;