import { z } from "zod";

export const reviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(1000),
  }),
});
