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
