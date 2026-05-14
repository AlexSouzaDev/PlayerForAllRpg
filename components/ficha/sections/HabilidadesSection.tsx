"use client";

import { calcModificador, formatModificador, calcBonusProficiencia } from "@/lib/utils";
import { HABILIDADES_DND } from "@/types/systems";
import type { FichaCompleta, HabilidadesData, Habilidade } from "@/types/ficha";

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

const ATRIBUTO_KEYS = {
  forca: "forca",
  destreza: "destreza",
  constituicao: "constituicao",
  inteligencia: "inteligencia",
  sabedoria: "sabedoria",
  carisma: "carisma",
} as const;

export function HabilidadesSection({ ficha, onSave }: Props) {
  const nivel = ficha.nivel ?? 1;
  const profBonus = ficha.bonusDeProficiencia ?? calcBonusProficiencia(nivel);

  const habilidadesData: HabilidadesData = (ficha.habilidades as HabilidadesData | null) ?? {
    habilidades: HABILIDADES_DND.map(h => ({ nome: h.nome, atributo: h.atributo, proficiente: false, expertise: false })),
    savingThrows: ["forca", "destreza", "constituicao", "inteligencia", "sabedoria", "carisma"].map(a => ({ atributo: a, proficiente: false })),
  };

  const toggleProficiencia = (index: number) => {
    const updated = { ...habilidadesData };
    const hab = { ...updated.habilidades[index] };
    if (!hab.proficiente && !hab.expertise) hab.proficiente = true;
    else if (hab.proficiente && !hab.expertise) { hab.proficiente = true; hab.expertise = true; }
    else { hab.proficiente = false; hab.expertise = false; }
    updated.habilidades = updated.habilidades.map((h, i) => i === index ? hab : h);
    onSave({ habilidades: updated });
  };

  const toggleSavingThrow = (index: number) => {
    const updated = { ...habilidadesData };
    const st = { ...updated.savingThrows[index], proficiente: !updated.savingThrows[index].proficiente };
    updated.savingThrows = updated.savingThrows.map((s, i) => i === index ? st : s);
    onSave({ habilidades: updated });
  };

  const getAttrValue = (attr: string): number =>
    ficha[attr as keyof typeof ATRIBUTO_KEYS] as number ?? 10;

  const getBonus = (hab: Habilidade): number => {
    const mod = calcModificador(getAttrValue(hab.atributo));
    if (hab.expertise) return mod + profBonus * 2;
    if (hab.proficiente) return mod + profBonus;
    return mod;
  };

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Saving Throws */}
      <div>
        <h3 className="font-cinzel font-semibold text-parchment text-sm mb-3 uppercase tracking-wider">Testes de Resistência</h3>
        <div className="space-y-1">
          {habilidadesData.savingThrows.map((st, i) => {
            const mod = calcModificador(getAttrValue(st.atributo));
            const total = st.proficiente ? mod + profBonus : mod;
            const label = { forca: "Força", destreza: "Destreza", constituicao: "Constituição", inteligencia: "Inteligência", sabedoria: "Sabedoria", carisma: "Carisma" }[st.atributo] ?? st.atributo;
            return (
              <button
                key={st.atributo}
                onClick={() => toggleSavingThrow(i)}
                aria-label={`${label} ${st.proficiente ? "proficiente" : "não proficiente"}`}
                className="flex items-center gap-3 w-full rounded px-2 py-1.5 hover:bg-surface transition-colors group"
              >
                <div className={`h-3.5 w-3.5 rounded-full border flex-shrink-0 transition-colors ${st.proficiente ? "bg-gold border-gold" : "border-muted bg-transparent"}`} />
                <span className="text-xs font-inter font-bold text-gold w-10 text-right">{formatModificador(total)}</span>
                <span className="text-sm font-lora text-parchment text-left">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-cinzel font-semibold text-parchment text-sm mb-3 uppercase tracking-wider">Perícias</h3>
        <div className="space-y-1">
          {habilidadesData.habilidades.map((hab, i) => {
            const total = getBonus(hab);
            return (
              <button
                key={hab.nome}
                onClick={() => toggleProficiencia(i)}
                aria-label={`${hab.nome} — clique para alternar proficiência`}
                className="flex items-center gap-3 w-full rounded px-2 py-1.5 hover:bg-surface transition-colors"
              >
                <div className={`h-3.5 w-3.5 rounded-sm border flex-shrink-0 transition-colors ${
                  hab.expertise ? "bg-arcane border-arcane" : hab.proficiente ? "bg-gold border-gold" : "border-muted bg-transparent"
                }`} />
                <span className="text-xs font-inter font-bold text-gold w-10 text-right">{formatModificador(total)}</span>
                <span className="text-sm font-lora text-parchment text-left flex-1">{hab.nome}</span>
                <span className="text-xs text-muted-rpg font-inter uppercase">
                  {hab.atributo.slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
