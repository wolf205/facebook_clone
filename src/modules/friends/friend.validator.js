import { z } from "zod";

export const idSchema = {
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};
