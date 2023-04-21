/* eslint-disable prefer-const */
import { type Item } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const topicRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({ id: z.string({ required_error: "Podcast Id is required" }) })
    )
    .query(async ({ ctx, input }) => {
      const topic = await ctx.prisma.item.findUnique({
        where: { id: input.id },
      });

      return topic;
    }),

  updateItem: publicProcedure
    .input(
      z.object({
        itemId: z.string({ required_error: "Item id is required" }),
        content: z.string().optional(),
        isCompleted: z.boolean().optional(),
        deleted: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const findItem = await ctx.prisma.item.findUnique({
        where: { id: input.itemId },
      });
      if (!findItem) throw new TRPCError({ code: "NOT_FOUND" });

      console.log("HERE IS THE INPUT", input);

      // @ts-ignore
      let updateData: Partial<Item> = {};
      if (input.content) updateData.content = input.content;
      if (input.deleted) updateData.deleted = input.deleted;

      updateData = {
        ...updateData,
        isCompleted: input.isCompleted ?? findItem.isCompleted,
      };

      console.log("HERE IS THE UPDATE DATA:", updateData);

      const updatedData = await ctx.prisma.item.update({
        where: { id: input.itemId },
        data: updateData,
      });

      return updatedData;
    }),

  create: publicProcedure
    .input(
      z.object({
        podcastId: z.string({ required_error: "Podcast ID is required" }),
        content: z.string({ required_error: "Content is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newItem = await ctx.prisma.item.create({ data: input });

      return newItem;
    }),
});
