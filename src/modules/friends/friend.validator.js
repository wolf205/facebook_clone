import { z } from "zod";

export const idSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
});
