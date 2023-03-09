import React from "react";
import LoadingDots from "../LoadingDots";

type PostCardType = {
  name: string;
};

function PostCard({ name }: PostCardType): JSX.Element {
  return (
    <div className="mt-10 w-full border-y border-black py-10 sm:rounded-lg sm:border sm:border-gray-50 sm:shadow-md">
      <div className="flex justify-between space-x-4 px-2 sm:px-10">
        <div className="flex flex-col space-y-2">
          <a
            target="_blank"
            rel="noreferrer"
            className="flex items-center text-left text-xl font-semibold"
          >
            {name}
          </a>
          <div className="inline gap-x-2 rounded-full bg-emerald-100/60 px-3 py-1 text-sm font-normal text-emerald-500 dark:bg-gray-800">
            Online
          </div>
          <div className="inline gap-x-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Offline
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-row  justify-between  space-x-3">
            <button
              onClick={() => {
                console.log("data");
              }}
              className={`w-12 ${
                true
                  ? "cursor-not-allowed bg-gray-100"
                  : "bg-white hover:border-black hover:text-black"
              }  rounded-md border border-solid border-gray-200 py-1.5 text-sm text-gray-500 transition-all duration-150 ease-in-out focus:outline-none`}
            >
              <LoadingDots />
            </button>
            <button
              className={`w-12 ${
                true ? "cursor-not-allowed bg-gray-100" : ""
              }bg-red-500  rounded-md border border-solid border-red-500 py-1.5 text-sm text-white transition-all duration-150 ease-in-out hover:bg-white hover:text-red-500 focus:outline-none`}
            >
              <LoadingDots />
            </button>
          </div>
          <button className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            <span>Qrcode</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostCard;
