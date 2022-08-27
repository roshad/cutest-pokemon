import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const appRouter = trpc.router().mutation("pokemon", {
  input: z.object({
    win: z.number(),
    lose: z.number(),
  }),
  async resolve({ input }) {
    const winner =await prisma.pokemon.upsert({
      where: {
        id: input.win,
      },
      update: {
        win: {increment:1},
        total:{increment:1},
      },
      create: {
        id: input.win,
        win: 1,
        total:1
      },
    })
    // upsert loser
    const loser =await prisma.pokemon.upsert({
      where: {
        id: input.lose,
      },
      update: {
        total:{increment:1},
      },
      create: {
        id: input.lose,
        win: 0,
        total:1
      },
    })
    console.log(winner,loser)
   
  },
});

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});



