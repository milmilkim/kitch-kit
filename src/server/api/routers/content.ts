import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

import { CreateContentSchema, GetContentListSchema, GetContentByIdSchema, UpdateContentSchema } from "@/lib/validators/content";

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

  getList: publicProcedure
    .input(GetContentListSchema)
    .query(async ({ ctx, input }) => {
      const page = input.page;
      const limit = input.limit;
      const category = input.category;
      const search = input.search;
      const skip = (page - 1) * limit;

      // 검색 조건 구성
      type WhereInput = {
        category?: typeof category;
        OR?: Array<{
          title?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
          platform?: { contains: string; mode: 'insensitive' };
        }>;
      };

      const where: WhereInput = {};
      
      if (category) {
        where.category = category;
      }

      if (search) {
        const searchCondition = {
          title: { contains: search, mode: 'insensitive' as const },
          description: { contains: search, mode: 'insensitive' as const },
          platform: { contains: search, mode: 'insensitive' as const },
        };
        where.OR = [
          { title: searchCondition.title },
          { description: searchCondition.description },
          { platform: searchCondition.platform },
        ];
      }

      // 데이터 조회
      const contentsList = await ctx.db.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          lastEditedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      
      const totalCount = await ctx.db.content.count({ where });

      return {
        contents: contentsList,
        pagination: {
          total: totalCount,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(GetContentByIdSchema)
    .query(async ({ ctx, input }) => {
      const content = await ctx.db.content.findUnique({
        where: { id: input.id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          lastEditedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!content) {
        throw new Error("컨텐츠를 찾을 수 없습니다.");
      }

      return content;
    }),

  update: protectedProcedure
    .input(UpdateContentSchema)
    .mutation(async ({ ctx, input }) => {
      // 컨텐츠 존재 여부 확인
      const existingContent = await ctx.db.content.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!existingContent) {
        throw new Error("컨텐츠를 찾을 수 없습니다.");
      }

      // 컨텐츠 업데이트
      const updatedContent = await ctx.db.content.update({
        where: { id: input.id },
        data: {
          title: input.title,
          category: input.category,
          year: input.year ?? undefined,
          platform: input.platform ?? undefined,
          description: input.description ?? "",
          artists: input.artists ?? [],
          aliases: input.aliases ?? [],
          tags: input.tags ?? [],
          lastEditedBy: { connect: { id: ctx.session.user.id } },
          image: input.image ?? undefined,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          lastEditedBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return updatedContent;
    }),
  
});
