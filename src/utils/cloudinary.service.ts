import { SignatureType } from "@/server/api/routers/upload";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export type CloudinaryUploadResponseAPI = {
  asset_id?: string;
  public_id?: string;
  version?: number;
  version_id?: string;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  created_at?: string;
  tags?: string[];
  bytes?: number;
  type?: string;
  etag?: string;
  placeholder?: boolean;
  url?: string;
  secure_url?: string;
  original_filename?: string;
  api_key?: string;
};

export const useCloudinaryUpload = (
  {
    cloudName = "",
    apiKey = "",
    timestamp = 0,
    signature = "",
    preset = "",
  }: SignatureType["signature"],
  setCompleted: Dispatch<SetStateAction<number>>,
  config: UseMutationOptions<
    CloudinaryUploadResponseAPI,
    AxiosError,
    FileList
  > = {}
) => {
  return useMutation(
    ["uploadClouadinary"],
    async (fileList: FileList): Promise<CloudinaryUploadResponseAPI> => {
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const file = fileList?.[0];

      if (!file) {
        return {} as CloudinaryUploadResponseAPI;
      }

      const formData: FormData = new FormData();
      formData.append("file", file, file?.name);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp as unknown as string);
      formData.append("signature", signature);
      return axios.post(url, formData, {
        withCredentials: false,
        onUploadProgress: function (progressEvent) {
          const progress = Math.round(
            (progressEvent.loaded * 100.0) / (progressEvent.total || 1)
          );
          setCompleted(progress);
        },
      });
    },
    config
  );
};
