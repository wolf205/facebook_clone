import { z } from "zod";

export const markReadNotification = {
  params: z.object({
    id: z.string().uuid("Id không hợp lệ").optional(),
  }),
};

export const getNotification = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(50).default(10).optional(),
  }),
};
