import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/server/db";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calcModificador, formatModificador, calcBonusProficiencia } from "@/lib/utils";
import type { FichaCompleta, InventarioItem, Magia, HabilidadesData } from "@/types/ficha";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ficha = await db.ficha.findUnique({
    where: { slug: params.slug },
    select: { nomePersonagem: true, classe: true, raca: true, nivel: true, isPublic: true, imageUrl: true },
  });

  if (!ficha?.isPublic) return { title: "Ficha não encontrada" };

  return {
    title: `${ficha.nomePersonagem} — PlayerForAllRPG`,
    description: `${ficha.raca ?? ""} ${ficha.classe ?? ""} ${ficha.nivel ? `Nível ${ficha.nivel}` : ""}`.trim(),
    openGraph: {
      title: ficha.nomePersonagem,
      description: `Ficha de personagem — ${ficha.classe ?? "RPG"}`,
      images: ficha.imageUrl ? [{ url: ficha.imageUrl }] : [],
    },
  };
}

const ATRIBUTOS = [
  { key: "forca" as const, abbr: "FOR" },
  { key: "destreza" as const, abbr: "DES" },
  { key: "constituicao" as const, abbr: "CON" },
  { key: "inteligencia" as const, abbr: "INT" },
  { key: "sabedoria" as const, abbr: "SAB" },
  { key: "carisma" as const, abbr: "CAR" },
];

export default async function PublicFichaPage({ params }: Props) {
  const fichaRaw = await db.ficha.findUnique({
    where: { slug: params.slug },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!fichaRaw || !fichaRaw.isPublic) return notFound();

  const ficha = fichaRaw as unknown as FichaCompleta & { user: { name: string | null; image: string | null } };
  const isDnD = ficha.sistema === "dnd5e";
  const prof = ficha.bonusDeProficiencia ?? calcBonusProficiencia(ficha.nivel ?? 1);
  const habilidades = ficha.habilidades as HabilidadesData | null;
  const inventario = (ficha.inventario ?? []) as InventarioItem[];
  const magias = ficha.magias as { lista?: Magia[] } | null;

  return (
    <div className="min-h-screen bg-background text-parchment">
      {/* Nav */}
      <nav className="border-b border-rpg px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="font-cinzel font-bold text-lg text-parchment hover:text-gold transition-colors">
          Player<span className="text-gold">ForAll</span>RPG
        </Link>
        <Link href="/register">
          <Button size="sm">Criar sua ficha grátis</Button>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="rounded-xl border border-gold/20 bg-surface parchment overflow-hidden">
          <div className="relative h-40 bg-gradient-to-br from-arcane/20 to-gold/10">
            {ficha.imageUrl && (
              <Image src={ficha.imageUrl} alt={ficha.nomePersonagem} fill className="object-cover opacity-50" />
            )}
            <div className="absolute inset-0 flex items-end p-6">
              <div className="flex items-end gap-4">
                <div className="rounded-lg border-2 border-gold/30 overflow-hidden h-20 w-20 flex-shrink-0">
                  {ficha.imageUrl
                    ? <Image src={ficha.imageUrl} alt={ficha.nomePersonagem} width={80} height={80} className="h-full w-full object-cover" />
                    : <Avatar name={ficha.nomePersonagem} size="xl" className="rounded-none" />
                  }
                </div>
                <div>
                  <h1 className="font-cinzel font-black text-3xl text-parchment drop-shadow-lg">{ficha.nomePersonagem}</h1>
                  <p className="text-muted-rpg font-lora text-sm drop-shadow">
                    {[ficha.raca, ficha.classe, ficha.nivel ? `Nível ${ficha.nivel}` : null].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant={isDnD ? "gold" : "arcane"}>{isDnD ? "D&D 5e" : ficha.sistema}</Badge>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 border-t border-rpg flex items-center gap-2 text-xs text-muted-rpg font-inter">
            <Avatar src={ficha.user.image} name={ficha.user.name} size="sm" />
            <span>por {ficha.user.name ?? "aventureiro"}</span>
          </div>
        </div>

        {/* Attributes */}
        {isDnD && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Atributos</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {ATRIBUTOS.map(({ key, abbr }) => {
                const val = ficha[key] ?? 10;
                const mod = calcModificador(val);
                return (
                  <div key={key} className="flex flex-col items-center rounded border border-rpg bg-background p-3">
                    <span className="text-xs font-inter text-muted-rpg">{abbr}</span>
                    <span className="text-2xl font-cinzel font-bold text-parchment mt-1">{val}</span>
                    <span className="text-sm text-gold">{formatModificador(mod)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Combat */}
        {isDnD && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Combate</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "HP", value: `${ficha.pontosDeVidaAtual ?? 0} / ${ficha.pontosDeVidaMax ?? 0}` },
                { label: "CA", value: String(ficha.classeDeArmadura ?? 0) },
                { label: "Iniciativa", value: ficha.iniciativa != null ? formatModificador(ficha.iniciativa) : "—" },
                { label: "Deslocamento", value: `${ficha.deslocamento ?? 0}m` },
                { label: "Prof.", value: `+${prof}` },
                { label: "Dado de Vida", value: ficha.dadoDeVida ?? "d8" },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center rounded border border-rpg bg-background px-4 py-3 min-w-[80px]">
                  <span className="text-xs font-inter text-muted-rpg uppercase">{label}</span>
                  <span className="text-lg font-cinzel font-bold text-parchment mt-1">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {habilidades?.habilidades && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Perícias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {habilidades.habilidades.map(h => {
                const attrVal = ficha[h.atributo as keyof FichaCompleta] as number ?? 10;
                const mod = calcModificador(attrVal);
                const total = h.expertise ? mod + prof * 2 : h.proficiente ? mod + prof : mod;
                return (
                  <div key={h.nome} className={`flex items-center gap-2 rounded px-2 py-1 ${h.proficiente ? "bg-gold/5" : ""}`}>
                    <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${h.expertise ? "bg-arcane" : h.proficiente ? "bg-gold" : "bg-muted"}`} />
                    <span className="text-sm font-lora text-parchment flex-1">{h.nome}</span>
                    <span className="text-xs font-inter text-gold font-bold">{formatModificador(total)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inventory */}
        {inventario.length > 0 && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Inventário</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {inventario.map(item => (
                <div key={item.id} className={`flex items-center gap-2 rounded px-2 py-1.5 border ${item.equipado ? "border-gold/20 bg-gold/5" : "border-transparent"}`}>
                  <span className="text-sm font-lora text-parchment flex-1">{item.nome}</span>
                  <span className="text-xs text-muted-rpg font-inter">×{item.quantidade}</span>
                  {item.equipado && <span className="text-xs text-gold font-inter">⚔</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spells */}
        {magias?.lista && magias.lista.length > 0 && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Magias</h2>
            <div className="space-y-1">
              {magias.lista.map(spell => (
                <div key={spell.id} className={`flex items-center gap-2 rounded px-2 py-1.5 ${spell.preparada ? "bg-arcane/5" : ""}`}>
                  <span className="text-sm font-lora text-parchment flex-1">{spell.nome}</span>
                  <span className="text-xs text-muted-rpg font-inter">{spell.nivel === 0 ? "Truque" : `${spell.nivel}°`}</span>
                  {spell.concentracao && <span className="text-xs text-arcane font-inter">C</span>}
                  {spell.ritual && <span className="text-xs text-gold font-inter">R</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story */}
        {ficha.historia && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">História</h2>
            <p className="text-sm font-lora text-parchment leading-relaxed whitespace-pre-wrap">{ficha.historia}</p>
          </div>
        )}

        {/* Custom fields */}
        {ficha.camposPersonalizados && Array.isArray(ficha.camposPersonalizados) && ficha.camposPersonalizados.length > 0 && (
          <div className="rounded-xl border border-rpg bg-surface p-5 parchment">
            <h2 className="font-cinzel font-semibold text-gold text-sm uppercase tracking-wider mb-4">Atributos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(ficha.camposPersonalizados as { id: string; chave: string; valor: string }[]).map(c => (
                <div key={c.id} className="rounded border border-rpg bg-background p-3">
                  <p className="text-xs text-muted-rpg font-inter uppercase tracking-wider">{c.chave}</p>
                  <p className="text-sm font-lora text-parchment mt-1">{c.valor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-muted-rpg font-lora mb-4">Crie sua própria ficha de personagem gratuitamente</p>
          <Link href="/register"><Button size="lg">Começar agora — é grátis</Button></Link>
        </div>
      </div>
    </div>
  );
}
