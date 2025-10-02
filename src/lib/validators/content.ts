import { z } from "zod";

import { ContentCategory } from "@prisma/client";

export const CreateContentSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  category: z.nativeEnum(ContentCategory),
  year: z.string().optional(),
  platform: z.string().optional(),
  description: z.string().optional(),
  artists: z.array(z.object({ value: z.string() })).optional(),
  aliases: z.array(z.object({ value: z.string() })).optional(),
  tags: z.array(z.object({ value: z.string() })).optional(),
  image: z.string().optional(),
});

export const GetContentListSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  category: z.nativeEnum(ContentCategory).optional(),
  search: z.string().optional(),
});

export const GetContentByIdSchema = z.object({
  id: z.string().min(1, "컨텐츠 ID가 필요합니다"),
});

export const UpdateContentSchema = z.object({
  id: z.string().min(1, "컨텐츠 ID가 필요합니다"),
  title: z.string().min(1, "제목을 입력하세요"),
  category: z.nativeEnum(ContentCategory),
  year: z.string().optional(),
  platform: z.string().optional(),
  description: z.string().optional(),
  artists: z.array(z.object({ value: z.string() })).optional(),
  aliases: z.array(z.object({ value: z.string() })).optional(),
  tags: z.array(z.object({ value: z.string() })).optional(),
  image: z.string().optional(),
});
