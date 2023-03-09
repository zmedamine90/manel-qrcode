import React, { FC, useEffect, useState } from "react";

import { type NextPage } from "next";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { SubmitHandler, useForm } from "react-hook-form";
import { SwitchField } from "@/components/SwitchField";
import { api } from "@/utils/api";
import { FiTrash2 } from "react-icons/fi";
import { useCloudinaryUpload } from "@/utils/cloudinary.service";
import { SignatureType } from "@/server/api/routers/upload";
import { FileCard } from "@/components/FileCard";
const Label: FC<
  {
    children: React.ReactNode;
  } & React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >
> = ({ children, ...rest }) => (
  <label
    {...rest}
    className="text-md mb-2 block font-medium text-gray-900 dark:text-gray-300"
  >
    {children}
  </label>
);

type FormValues = {
  title: string;
  file: FileList;
  isPublic: boolean;
};

const NewPost: NextPage = () => {
  const {
    register,
    control,
    setError,
    clearErrors,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      isPublic: false,
      file: {} as FileList,
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const [complete, setComplete] = useState<number>(0);

  const { data: cloudinarySignature } =
    api.upload.getCloudinarySignature.useQuery();

  const safeCloudinarySignature =
    cloudinarySignature?.signature || ({} as SignatureType["signature"]);

  const { mutateAsync: upload, isLoading: isUploadLoading } =
    useCloudinaryUpload(safeCloudinarySignature, setComplete);

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log("Submited form");
    console.log(data);
  };

  const resetFile = () => {
    reset({
      file: {} as FileList,
    });
  };

  const files = watch("file");
  const file = files[0] || null;

  useEffect(() => {
    console.log("Calling use effect");
    const allowedExtensions = /(\.mp4|\..avi|\..mov|\..mkv|\.mp3)$/i;

    if (!file) {
      setError("file", {
        type: "required",
        message: "Le ficher est requis",
      });
      return;
    }

    if (!!file && !allowedExtensions.exec(file.name)) {
      setError("file", {
        type: "filetype",
        message:
          "Le ficher doit avoir une extension supportée. Les extensions: .mp4, .avi, .mov. .mkv ou .mp3 ",
      });
      return;
    }

    if (!!file && Array.isArray(allowedExtensions.exec(file.name))) {
      clearErrors("file");
      upload(files).catch((e) => console.log(e));
    }
  }, [file, setError, clearErrors]);

  return (
    <>
      <Head>
        <title>Create new post</title>
      </Head>
      <Navbar />
      <main className="flex flex-col items-center  justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-[2rem]">
            Créer une nouvelle publication
          </h3>
          <div className="w-full max-w-md">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <main className="flex items-center justify-center font-sans">
                <div className="flex flex-col space-y-12">
                  <div>
                    <>
                      <Label htmlFor="title">titre publication</Label>
                      <input
                        type="text"
                        {...register("title", {
                          required: "Le titre est requis",
                        })}
                        id="title"
                        className="text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Le title de la publication"
                      />
                      {!!errors?.title && (
                        <span className="text-md mt-1 ml-1 flex items-center font-medium tracking-wide text-red-500">
                          {errors?.title?.message}
                        </span>
                      )}
                    </>
                  </div>
                  {!!file ? (
                    <div>
                      <FileCard
                        file={file}
                        complete={complete}
                        resetFile={resetFile}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="dropzone-file">
                        Upload
                        <div className="mx-auto flex w-full max-w-lg cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>

                          <h2 className="mt-4 text-xl font-medium tracking-wide text-gray-700">
                            Ajouter le ficher son
                          </h2>

                          <p className="mt-2 tracking-wide text-gray-500">
                            Le fichier doit être au format .mp4, .avi, .mov ou
                            .mkv
                          </p>

                          <input
                            {...register("file", {
                              required: "Le ficher est requis",
                            })}
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                          />
                        </div>
                      </Label>
                      {!!errors?.file && (
                        <div className="max-w-md">
                          <span className="text-md mt-1 ml-1 flex items-center font-medium tracking-wide text-red-500">
                            {errors?.file?.message}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <Label htmlFor="isPublic">Est public</Label>
                    <SwitchField
                      id="isPublic"
                      control={control}
                      {...register("isPublic")}
                    />
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      className="flex shrink-0 items-center justify-center gap-x-2 rounded-lg border-2 border-gray-800 px-5 py-2 text-sm tracking-wide text-gray-800 transition-colors duration-200 hover:bg-gray-800 hover:text-white sm:w-auto"
                    >
                      <span>Ajouter</span>
                    </button>
                  </div>
                </div>
              </main>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewPost;
