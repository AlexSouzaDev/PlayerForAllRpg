"use client";

import { calcModificador, formatModificador } from "@/lib/utils";
import type { FichaCompleta } from "@/types/ficha";

const ATRIBUTOS = [
  { key: "forca" as const, label: "Força", abbr: "FOR" },
  { key: "destreza" as const, label: "Destreza", abbr: "DES" },
  { key: "constituicao" as const, label: "Constituição", abbr: "CON" },
  { key: "inteligencia" as const, label: "Inteligência", abbr: "INT" },
  { key: "sabedoria" as const, label: "Sabedoria", abbr: "SAB" },
  { key: "carisma" as const, label: "Carisma", abbr: "CAR" },
];

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

export function AtributosSection({ ficha, onSave }: Props) {
  return (
    <div className="p-4">
      <h2 className="font-cinzel font-semibold text-lg text-parchment mb-6">Atributos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {ATRIBUTOS.map(({ key, label, abbr }) => {
          const val = ficha[key] ?? 10;
          const mod = calcModificador(val);
          return (
            <div
              key={key}
              className="flex flex-col items-center rounded-lg border border-rpg bg-background p-4 parchment hover:border-gold/30 transition-colors"
            >
              <span className="text-xs font-inter text-muted-rpg uppercase tracking-widest mb-2">{abbr}</span>
              <input
                type="number"
                min={1}
                max={30}
                value={val}
                aria-label={label}
                onChange={e => {
                  const n = parseInt(e.target.value);
                  if (!isNaN(n) && n >= 1 && n <= 30) onSave({ [key]: n });
                }}
                className="w-16 text-center text-3xl font-cinzel font-bold text-parchment bg-transparent border-none outline-none focus:text-gold transition-colors"
              />
              <div className="mt-2 w-8 h-8 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center">
                <span className="text-sm font-lora font-semibold text-gold">{formatModificador(mod)}</span>
              </div>
              <span className="mt-1 text-xs text-muted-rpg font-inter">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
