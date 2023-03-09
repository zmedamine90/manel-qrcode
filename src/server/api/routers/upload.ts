import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getCloudinarySignature } from "@/server/controller/cloudinary";

const signatureSchema = z.object({
  signature: z.object({
    timestamp: z.number(),
    signature: z.string(),
    apiKey: z.string(),
    cloudName: z.string(),
    preset: z.string(),
  }),
});

export type SignatureType = z.infer<typeof signatureSchema>;

export const uploadRouter = createTRPCRouter({
  getCloudinarySignature: protectedProcedure
    .output(signatureSchema)
    .query(() => {
      return { signature: getCloudinarySignature() };
    }),
});
