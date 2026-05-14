"use client";

import type { FichaCompleta, Tracos } from "@/types/ficha";

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

function TextareaField({ label, value, onChange, rows = 3 }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded border border-rpg bg-background px-3 py-2 text-sm text-parchment font-lora placeholder:text-muted-rpg focus:border-gold focus:outline-none resize-none transition-colors"
      />
    </div>
  );
}

export function HistoriaSection({ ficha, onSave }: Props) {
  const tracos: Tracos = (ficha.tracos as Tracos | null) ?? {};

  const updateTraco = (key: keyof Tracos, value: string) =>
    onSave({ tracos: { ...tracos, [key]: value } });

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-cinzel font-semibold text-parchment">História & Traços</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField
          label="Traço de Personalidade"
          value={tracos.tracoPersonalidade ?? ""}
          onChange={v => updateTraco("tracoPersonalidade", v)}
        />
        <TextareaField
          label="Ideal"
          value={tracos.ideal ?? ""}
          onChange={v => updateTraco("ideal", v)}
        />
        <TextareaField
          label="Vínculo"
          value={tracos.vinculo ?? ""}
          onChange={v => updateTraco("vinculo", v)}
        />
        <TextareaField
          label="Fraqueza"
          value={tracos.fraqueza ?? ""}
          onChange={v => updateTraco("fraqueza", v)}
        />
      </div>

      <TextareaField
        label="História / Backstory"
        value={ficha.historia ?? ""}
        onChange={v => onSave({ historia: v })}
        rows={8}
      />
    </div>
  );
}
