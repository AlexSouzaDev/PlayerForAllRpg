import { z } from "zod";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

function gerarSlug(nome: string): string {
  const base = slugify(nome, { lower: true, strict: true, locale: "pt" });
  return `${base}-${nanoid(4)}`;
}

function jsonOrNull(value: unknown): Prisma.InputJsonValue | typeof Prisma.DbNull {
  if (value === null || value === undefined) return Prisma.DbNull;
  return value as Prisma.InputJsonValue;
}

const fichaUpdateSchema = z.object({
  nomePersonagem: z.string().min(1).max(100).optional(),
  sistema: z.string().optional(),
  imageUrl: z.string().url().nullish(),
  raca: z.string().nullish(),
  classe: z.string().nullish(),
  subclasse: z.string().nullish(),
  nivel: z.number().int().min(1).max(20).nullish(),
  antecedente: z.string().nullish(),
  alinhamento: z.string().nullish(),
  xp: z.number().int().min(0).nullish(),
  forca: z.number().int().min(1).max(30).nullish(),
  destreza: z.number().int().min(1).max(30).nullish(),
  constituicao: z.number().int().min(1).max(30).nullish(),
  inteligencia: z.number().int().min(1).max(30).nullish(),
  sabedoria: z.number().int().min(1).max(30).nullish(),
  carisma: z.number().int().min(1).max(30).nullish(),
  pontosDeVidaMax: z.number().int().min(0).nullish(),
  pontosDeVidaAtual: z.number().int().nullish(),
  classeDeArmadura: z.number().int().min(0).nullish(),
  iniciativa: z.number().int().nullish(),
  deslocamento: z.number().int().min(0).nullish(),
  bonusDeProficiencia: z.number().int().min(0).nullish(),
  dadoDeVida: z.string().nullish(),
  habilidades: z.any().nullish(),
  inventario: z.any().nullish(),
  magias: z.any().nullish(),
  tracos: z.any().nullish(),
  historia: z.string().nullish(),
  notas: z.string().nullish(),
  camposPersonalizados: z.any().nullish(),
});

export const fichaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        nomePersonagem: z.string().min(1).max(100),
        sistema: z.string().default("dnd5e"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slug = gerarSlug(input.nomePersonagem);
      const userId = ctx.session.user.id!;
      return ctx.db.ficha.create({
        data: {
          slug,
          userId,
          nomePersonagem: input.nomePersonagem,
          sistema: input.sistema,
          nivel: input.sistema === "dnd5e" ? 1 : null,
          pontosDeVidaAtual: input.sistema === "dnd5e" ? 10 : null,
          pontosDeVidaMax: input.sistema === "dnd5e" ? 10 : null,
          forca: input.sistema === "dnd5e" ? 10 : null,
          destreza: input.sistema === "dnd5e" ? 10 : null,
          constituicao: input.sistema === "dnd5e" ? 10 : null,
          inteligencia: input.sistema === "dnd5e" ? 10 : null,
          sabedoria: input.sistema === "dnd5e" ? 10 : null,
          carisma: input.sistema === "dnd5e" ? 10 : null,
          classeDeArmadura: input.sistema === "dnd5e" ? 10 : null,
          deslocamento: input.sistema === "dnd5e" ? 9 : null,
          bonusDeProficiencia: input.sistema === "dnd5e" ? 2 : null,
        },
      });
    }),

  list: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id!;
    return ctx.db.ficha.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        slug: true,
        nomePersonagem: true,
        sistema: true,
        imageUrl: true,
        classe: true,
        nivel: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const ficha = await ctx.db.ficha.findUnique({ where: { id: input.id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
      return ficha;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(fichaUpdateSchema))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const { id, habilidades, inventario, magias, tracos, camposPersonalizados, ...rest } = input;
      const ficha = await ctx.db.ficha.findUnique({ where: { id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.ficha.update({
        where: { id },
        data: {
          ...rest,
          ...(habilidades !== undefined && { habilidades: jsonOrNull(habilidades) }),
          ...(inventario !== undefined && { inventario: jsonOrNull(inventario) }),
          ...(magias !== undefined && { magias: jsonOrNull(magias) }),
          ...(tracos !== undefined && { tracos: jsonOrNull(tracos) }),
          ...(camposPersonalizados !== undefined && { camposPersonalizados: jsonOrNull(camposPersonalizados) }),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const ficha = await ctx.db.ficha.findUnique({ where: { id: input.id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
      await ctx.db.ficha.delete({ where: { id: input.id } });
      return { success: true };
    }),

  uploadImage: protectedProcedure
    .input(z.object({ id: z.string(), imageUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const ficha = await ctx.db.ficha.findUnique({ where: { id: input.id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.ficha.update({ where: { id: input.id }, data: { imageUrl: input.imageUrl } });
    }),

  togglePublic: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const ficha = await ctx.db.ficha.findUnique({ where: { id: input.id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });
      return ctx.db.ficha.update({
        where: { id: input.id },
        data: {
          isPublic: !ficha.isPublic,
          publicToken: !ficha.isPublic ? nanoid(12) : ficha.publicToken,
        },
      });
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id!;
      const ficha = await ctx.db.ficha.findUnique({ where: { id: input.id } });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (ficha.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });

      return ctx.db.ficha.create({
        data: {
          slug: gerarSlug(`${ficha.nomePersonagem}-copia`),
          userId,
          nomePersonagem: `${ficha.nomePersonagem} (cópia)`,
          sistema: ficha.sistema,
          imageUrl: ficha.imageUrl,
          raca: ficha.raca,
          classe: ficha.classe,
          subclasse: ficha.subclasse,
          nivel: ficha.nivel,
          antecedente: ficha.antecedente,
          alinhamento: ficha.alinhamento,
          xp: ficha.xp,
          forca: ficha.forca,
          destreza: ficha.destreza,
          constituicao: ficha.constituicao,
          inteligencia: ficha.inteligencia,
          sabedoria: ficha.sabedoria,
          carisma: ficha.carisma,
          pontosDeVidaMax: ficha.pontosDeVidaMax,
          pontosDeVidaAtual: ficha.pontosDeVidaAtual,
          classeDeArmadura: ficha.classeDeArmadura,
          iniciativa: ficha.iniciativa,
          deslocamento: ficha.deslocamento,
          bonusDeProficiencia: ficha.bonusDeProficiencia,
          dadoDeVida: ficha.dadoDeVida,
          habilidades: jsonOrNull(ficha.habilidades),
          inventario: jsonOrNull(ficha.inventario),
          magias: jsonOrNull(ficha.magias),
          tracos: jsonOrNull(ficha.tracos),
          historia: ficha.historia,
          notas: ficha.notas,
          camposPersonalizados: jsonOrNull(ficha.camposPersonalizados),
          isPublic: false,
          publicToken: null,
        },
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const ficha = await ctx.db.ficha.findUnique({
        where: { slug: input.slug },
        include: { user: { select: { name: true, image: true } } },
      });
      if (!ficha) throw new TRPCError({ code: "NOT_FOUND" });
      if (!ficha.isPublic) throw new TRPCError({ code: "FORBIDDEN" });
      return ficha;
    }),
});
