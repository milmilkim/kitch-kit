import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { CreateContentSchema } from "@/lib/validators/content";

export const contentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateContentSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.content.create({
        data: {
          title: input.title,
          category: input.category,
          year: input.year ?? undefined,
          platform: input.platform ?? undefined,
          description: input.description ?? "",
          artists: input.artists ?? [],
          aliases: input.aliases ?? [],
          tags: input.tags ?? [],
          createdBy: { connect: { id: ctx.session.user.id } },
          lastEditedBy: { connect: { id: ctx.session.user.id } },
          image: input.image ?? undefined,
        },
      });
    }),
});
