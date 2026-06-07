import { z } from "zod";

export const idSchema = {
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};

export const getListFriendSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    search: z.string().trim().optional(),
  }),
};