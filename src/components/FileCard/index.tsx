import { FiTrash2 } from "react-icons/fi";

type FileCardProps = {
  file: File;
  resetFile: () => void;
  complete: number;
};

export const FileCard = ({
  file,
  complete,
  resetFile,
}: FileCardProps): JSX.Element => {
  console.log(complete);
  return (
    <div className="mx-4  flex max-w-md rounded-lg bg-white shadow-lg md:mx-auto md:max-w-2xl ">
      <div className="flex w-full flex-col items-start space-y-5 px-4 py-6">
        <div className="flex w-full items-center justify-between">
          <div>
            <h2 className="-mt-1 text-lg font-semibold text-gray-900">
              {file?.name}
            </h2>
            <small>{Math.round((file?.size || 0) / 1024 ** 2)} mb</small>
          </div>
          <button className="flex shrink-0 items-center justify-center gap-x-2 rounded-full border-2 border-red-600 px-2 py-2 text-sm tracking-wide text-red-800 transition-colors duration-200 hover:bg-red-800 hover:text-white sm:w-auto">
            <FiTrash2
              onClick={resetFile}
              className="block h-6 w-6"
              aria-hidden="true"
            />
          </button>
        </div>
        <div className="relative pt-1">
          <div className="mb-2 flex items-center justify-between space-x-5">
            <div>
              <span
                className={`inline-block rounded-full bg-${
                  complete === 100 ? "emerald" : "pink"
                }-200 py-1 px-2 text-xs font-semibold uppercase text-${
                  complete === 100 ? "emerald" : "pink"
                }-600`}
              >
                Uploading
              </span>
            </div>
            <div className="text-right">
              <span
                className={`inline-block text-xs font-semibold text-${
                  complete === 100 ? "emerald" : "pink"
                }-600`}
              >
                {complete}%
              </span>
            </div>
          </div>
          <div
            className={`mb-4 flex h-2 overflow-hidden rounded bg-${
              complete === 100 ? "emerald" : "pink"
            }-200 text-xs`}
          >
            <div
              style={{ width: `${complete}%` }}
              className={`flex flex-col justify-center whitespace-nowrap bg-${
                complete === 100 ? "emerald" : "pink"
              }-500 text-center text-white shadow-none`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
