import { KeyboardProps } from "../../../util/types.ts";
import { HeartIcon, ShareIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/20/solid";
import { lorem } from "../../../util/helpers.ts";
import KeyboardCarousel from "./KeyboardCarousel.tsx";
import { Link } from "react-router-dom";
import { Avatar } from "flowbite-react";

export default function MobileKeyboardCard({
  keyboard,
}: {
  keyboard: KeyboardProps;
}) {

  return (
    <>
      <div className="px-4 py-2 flex items-center space-x-2">
        <Avatar
          img={
            "https://cdn.tailkit.com/media/placeholders/avatar-iFgRcqHznqg-160x160.jpg"
          }
        />
        <div>
          <p className={"text-md"}>{keyboard.theme_name}</p>
          <p className="font-light text-sm text-gray-500">
            {lorem.generateWords(2)}
          </p>
        </div>
      </div>
      {keyboard.image_path && (
        <Link to={`/keyboard/${keyboard.id}`}>
          <KeyboardCarousel image={keyboard.image_path} />
        </Link>
      )}
      <div className="px-4 py-2 mb-10 flex text-left items-center justify-between">
        <div className={"flex justify-between space-x-2"}>
          <button
            type="button"
            className="inline-flex items-center rounded-md justify-center space-x-2 border border-gray-200 bg-white px-2 py-1 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
          >
            <HeartIcon className={"h-6 w-6"} />
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md justify-center space-x-2 border border-gray-200 bg-white px-2 py-1 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
          >
            <PlusIcon className={"h-6 w-6"} />
          </button>
        </div>
        <button
          type="button"
          className="inline-flex items-center rounded-md justify-center space-x-2 border border-gray-200 bg-white px-2 py-1 text-sm font-semibold leading-5 text-gray-800 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm focus:ring focus:ring-gray-300 focus:ring-opacity-25 active:border-gray-200 active:shadow-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-opacity-40 dark:active:border-gray-700"
        >
          <ShareIcon className={"h-6 w-6"} />
        </button>
      </div>
    </>
  );
}
