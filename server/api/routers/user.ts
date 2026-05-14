import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(60),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.user.findUnique({ where: { email: input.email } });
      if (exists) throw new TRPCError({ code: "CONFLICT", message: "Email já cadastrado" });
      const hash = await bcrypt.hash(input.password, 12);
      const user = await ctx.db.user.create({
        data: { name: input.name, email: input.email, password: hash },
      });
      return { id: user.id, email: user.email, name: user.name };
    }),

  me: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id! },
      select: { id: true, name: true, email: true, image: true, createdAt: true },
    });
  }),
});
