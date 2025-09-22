import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const ContentCategory = z.enum(["NOVEL", "WEBTOON", "GAME", "ANIME", "MOVIE", "MUSIC", "COMIC", "OTHER"]);

export const contentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        category: z.enum(["NOVEL", "WEBTOON", "GAME", "COMIC", "ANIME", "MOVIE", "MUSIC", "OTHER"]),
        year: z.string().optional(),
        platform: z.string().optional(),
        description: z.string().optional(),
        artists: z.array(z.string()).optional(),
        aliases: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.content.create({
        data: {
          title: input.title,
          category: input.category,
          year: input.year ?? undefined,
          platform: input.platform ?? undefined,
          description: input.description ?? "",
          artists: input.artists ?? [],
          tags: input.tags ?? [],
          createdBy: { connect: { id: ctx.session.user.id } },
          lastEditedBy: { connect: { id: ctx.session.user.id } },
          aliases: input.aliases ?? [],
        },
      });
    }),
});
