import { z } from "zod";

export const idSchema = {
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};

export const getListFriendSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    search: z.string().optional(),
  }),
};
