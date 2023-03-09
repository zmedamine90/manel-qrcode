import * as Cloudinary from "cloudinary";
import { env } from "@/env.mjs";

export const getCloudinarySignature = () => {
  console.log("Getting cloudinary signature.....");

  const timestamp = new Date().getTime();
  const signature = Cloudinary.v2.utils.api_sign_request(
    {
      timestamp,
    },
    env.CLOUDINARY_SECRET
  );

  return {
    timestamp,
    signature,
    apiKey: env.CLOUDINARY_API_KEY,
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    preset: env.CLOUDINARY_PRESET,
  };
};
