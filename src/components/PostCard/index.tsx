import React from "react";
import LoadingDots from "../LoadingDots";
import { AwesomeQR } from "awesome-qr";
import { PostType } from "@/server/api/routers/post";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

type PostCardProps = {
  post: PostType;
};

function PostCard({ post }: PostCardProps): JSX.Element {
  const downloadQrcode = async () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || ""}/posts/${post.id}`;
    const qrcode = await new AwesomeQR({
      text: url,
      size: 800,
    }).draw();
    const downloadLink = document.createElement("a");
    downloadLink.href = qrcode as string;
    downloadLink.download = `${post.title}.png`;
    downloadLink.click();
  };

  return (
    <div className="mt-5 w-full border-black  py-2 shadow-md sm:mt-10 sm:rounded-lg sm:border sm:border-gray-50">
      <div className="flex justify-between space-x-4 px-2 sm:px-10">
        <div className="flex flex-col space-y-2">
          <Link href={`/posts/${post.id}`} legacyBehavior>
            <a className="flex items-center text-left text-xl font-semibold">
              {post?.title}
            </a>
          </Link>
          <div>
            {post.isPublic ? (
              <div className="inline gap-x-2 rounded-full bg-emerald-100  px-3 py-1 text-sm font-normal text-emerald-500">
                Online
              </div>
            ) : (
              <div className="inline gap-x-2 rounded-full bg-gray-100 px-3 py-1 text-sm font-normal text-gray-500">
                Offline
              </div>
            )}
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

            {/* <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-full border-2 border-red-600 px-2 py-2 text-sm tracking-wide text-red-800 transition-colors duration-200 hover:bg-red-800 hover:text-white sm:w-auto">
              <FiTrash2
                onClick={deletePost}
                className="block h-6 w-6"
                aria-hidden="true"
              />
            </button> */}
          </div>
          <button
            onClick={() => downloadQrcode()}
            className="bg-grey-light hover:bg-grey text-grey-darkest inline-flex items-center rounded py-2 px-4 font-bold"
          >
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
