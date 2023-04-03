import React, { ChangeEvent, FC, useEffect, useState } from "react";

import { GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { SubmitHandler, useForm } from "react-hook-form";
import { SwitchField } from "@/components/SwitchField";
import { api } from "@/utils/api";
import { FileCard } from "@/components/FileCard";
import { useUploadAwsS3 } from "@/utils/s3.service";
import { PresignedPost } from "aws-sdk/clients/s3";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingDots from "@/components/LoadingDots";

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
  files: FileList;
  isPublic: boolean;
};

const NewPost: NextPage<{ protectedProp: boolean }> = ({ protectedProp }) => {
  const {
    register,
    control,
    watch,
    resetField,
    setValue,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      isPublic: false,
      files: {} as FileList,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { data: sessionData } = useSession();
  const router = useRouter();

  if (!sessionData && typeof window !== "undefined") {
    router.push("/").catch((error) => console.log(error));
  }

  const files = watch("files");
  const file = files[0] || null;

  const [complete, setComplete] = useState<number>(0);

  const { mutateAsync: upload, isLoading: isUploading } =
    useUploadAwsS3(setComplete);

  const { mutate: getPresignMutation, isLoading: isGettingPresign } =
    api.upload.getPresignUrl.useMutation({
      onSuccess: (data) => {
        upload({ files, ...(data as PresignedPost) })
          .then((data) => {
            console.log(data);
          })
          .catch((err) => console.log(err));
      },
    });

  const { mutate: createPost, isLoading: isCreatingPost } =
    api.post.createPost.useMutation({
      onSuccess: (data) => {
        router.push("/").catch((error) => console.log(error));
        toast("Publication créé avec succès");
      },
    });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    if (!data || !data.files) return;

    const fileData = files[0] as File;

    createPost({
      filename: fileData.name,
      isPublic: data.isPublic,
      title: data.title,
    });
  };

  const resetFile = () => {
    console.log("Reset clicked");
    setValue("files", {} as FileList);
  };

  const isLoading = isUploading || isGettingPresign || isCreatingPost;

  const isButtonDisabled = (!isValid && isSubmitted) || isLoading;
  // // useEffect(() => {
  //   if (Object.keys(errors?.files || {}).length > 0) {
  //     console.log("Sending ");
  //     getPresignMutation({ filename: file?.name || "" });
  //   }
  // // }, [file, errors, getPresignMutation]);

  return (
    <>
      <Head>
        <title>Create new post</title>
      </Head>
      <main className="flex flex-col items-center  justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-8 ">
          <h3 className="text-2xl font-extrabold tracking-tight sm:text-[2rem]">
            Créer une nouvelle publication
          </h3>
          <span>{JSON.stringify(isValid)}</span>
          <div className="w-full max-w-md">
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
              <main className="flex w-full items-center justify-center font-sans">
                <div className="flex w-full flex-col space-y-12">
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

                  <div>
                    {!!file ? (
                      <FileCard
                        file={file}
                        complete={complete}
                        resetFile={resetFile}
                        isValid={!errors?.files}
                      />
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
                          </div>
                        </Label>
                      </div>
                    )}

                    <input
                      {...register("files", {
                        validate: {
                          required: (files) => {
                            return (
                              Object.keys(files).length > 0 ||
                              "This field is required"
                            );
                          },
                          lessThan10MB: (files) =>
                            (!!files[0] && files[0].size < 10000000) ||
                            "Max 10MB",
                          acceptedFormats: (files) => {
                            return (
                              ["audio/mpeg"].includes(files[0]?.type || "") ||
                              "Only Mp3 supported"
                            );
                          },
                        },
                        onChange: (event: ChangeEvent<HTMLInputElement>) => {
                          const file = (
                            (event?.target?.files || {}) as FileList
                          )?.[0];

                          if (
                            !!file &&
                            file.size < 10000000 &&
                            ["audio/mpeg"].includes(file.type)
                          ) {
                            setComplete(0);

                            getPresignMutation({
                              filename:
                                ((event?.target?.files || {}) as FileList)?.[0]
                                  ?.name || "",
                            });
                          }
                        },
                      })}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                    {!!errors?.files && (
                      <div className="max-w-md">
                        <span className="text-md mt-1 ml-1 flex items-center font-medium tracking-wide text-red-500">
                          {errors?.files?.message}
                        </span>
                      </div>
                    )}
                  </div>
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
                      disabled={isButtonDisabled}
                      className={`${
                        isButtonDisabled
                          ? "cursor-not-allowed rounded  border-gray-500 py-2 px-4 font-bold text-gray-500  opacity-50"
                          : ""
                      } flex shrink-0 items-center justify-center gap-x-2 rounded-lg border-2 border-gray-800 px-5 py-2 text-sm tracking-wide text-gray-800 transition-colors duration-200 hover:bg-gray-800 hover:text-white sm:w-auto`}
                    >
                      {isLoading ? <LoadingDots /> : <span>Ajouter</span>}
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

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      protectedProp: true,
    },
  };
};

export default NewPost;
