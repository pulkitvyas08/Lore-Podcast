/* eslint-disable prefer-const */
import { type Podcast } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const podcastRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allPodcasts = await ctx.prisma.podcast.findMany();

    return allPodcasts;
  }),

  getById: publicProcedure
    .input(
      z.object({ id: z.string({ required_error: "Podcast Id is required" }) })
    )
    .query(async ({ ctx, input }) => {
      const podcast = await ctx.prisma.podcast.findUnique({
        where: { id: input.id },
      });

      if (!podcast) throw new TRPCError({ code: "NOT_FOUND" });

      const findAllTopics = await ctx.prisma.item.findMany({
        where: { podcastId: input.id, deleted: false },
      });

      return { podcast: podcast, topics: findAllTopics };
    }),

  updatePodcast: publicProcedure
    .input(
      z.object({
        id: z.string({ required_error: "podcast Id is required" }),
        description: z.string().optional(),
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const findPodcast = await ctx.prisma.podcast.findUnique({
        where: { id: input.id },
      });
      if (!findPodcast) throw new TRPCError({ code: "NOT_FOUND" });

      // @ts-ignore
      let updateData: Partial<Podcast> = {};
      if (input.title) updateData.title = input.title;
      if (input.description) updateData.description = input.description;

      const updatedData = await ctx.prisma.podcast.update({
        where: { id: input.id },
        data: updateData,
      });

      return updatedData;
    }),

  create: publicProcedure
    .input(
      z.object({
        podcastDate: z.string({ required_error: "podcastDate is required" }),
        description: z.string().optional(),
        title: z.string({ required_error: "Title is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newPodcastData = {
        ...input,
        podcastDate: new Date(input.podcastDate),
      };

      const newPodcast = await ctx.prisma.podcast.create({
        data: newPodcastData,
      });

      return newPodcast;
    }),
});
