import { createTRPCRouter } from "@/server/api/trpc";
import { fichaRouter } from "@/server/api/routers/ficha";
import { userRouter } from "@/server/api/routers/user";

export const appRouter = createTRPCRouter({
  ficha: fichaRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
