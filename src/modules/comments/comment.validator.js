import { z } from "zod";

export const createSchema = {
  body: z.object({
    content: z.string().min(1, "Content không được để trống"),
    parentId: z.string().uuid("Id không hợp lệ").optional(),
  }),
  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};

export const getSchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),

  params: z.object({
    id: z.string().uuid("Id không hợp lệ"),
  }),
};
