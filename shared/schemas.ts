import { z } from "zod";

export const fileInfoSchema = z.object({
  url: z.string(),
  name: z.string(),
  size: z.number(),
});

export type FileInfo = z.infer<typeof fileInfoSchema>;
