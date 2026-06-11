import { z } from "zod";

export const likeSchema = {
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};
