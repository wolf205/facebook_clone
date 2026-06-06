import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid("Id người nhận không hợp lệ"),
  }),
});
