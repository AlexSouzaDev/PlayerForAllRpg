"use client";

import { Shield, Heart, Zap, Wind, Dice6 } from "lucide-react";
import type { FichaCompleta } from "@/types/ficha";

interface StatInputProps {
  label: string;
  value: number | null | undefined;
  min?: number;
  max?: number;
  icon?: React.ReactNode;
  onSave: (v: number) => void;
}

function StatInput({ label, value, min = 0, max = 999, icon, onSave }: StatInputProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-rpg bg-background p-4 parchment min-w-[96px]">
      {icon && <div className="text-gold mb-2">{icon}</div>}
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? 0}
        aria-label={label}
        onChange={e => {
          const n = parseInt(e.target.value);
          if (!isNaN(n)) onSave(n);
        }}
        className="w-20 text-center text-2xl font-cinzel font-bold text-parchment bg-transparent border-none outline-none focus:text-gold"
      />
      <span className="mt-1 text-xs font-inter text-muted-rpg text-center uppercase tracking-wider">{label}</span>
    </div>
  );
}

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

export function CombateSection({ ficha, onSave }: Props) {
  return (
    <div className="p-4 space-y-6">
      <h2 className="font-cinzel font-semibold text-lg text-parchment">Combate</h2>

      {/* HP tracker */}
      <div className="rounded-lg border border-rpg bg-background p-4 parchment">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="h-4 w-4 text-danger" />
          <span className="font-cinzel font-semibold text-parchment text-sm">Pontos de Vida</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">Atual</label>
            <input
              type="number"
              value={ficha.pontosDeVidaAtual ?? 0}
              aria-label="HP atual"
              onChange={e => {
                const n = parseInt(e.target.value);
                if (!isNaN(n)) onSave({ pontosDeVidaAtual: n });
              }}
              className="block w-full text-3xl font-cinzel font-bold text-parchment bg-transparent border-b border-rpg focus:border-gold outline-none pb-1 mt-1"
            />
          </div>
          <span className="text-3xl text-muted-rpg font-cinzel">/</span>
          <div className="flex-1">
            <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">Máximo</label>
            <input
              type="number"
              value={ficha.pontosDeVidaMax ?? 0}
              aria-label="HP máximo"
              onChange={e => {
                const n = parseInt(e.target.value);
                if (!isNaN(n)) onSave({ pontosDeVidaMax: n });
              }}
              className="block w-full text-3xl font-cinzel font-bold text-muted-rpg bg-transparent border-b border-rpg focus:border-gold outline-none pb-1 mt-1"
            />
          </div>
        </div>
        {ficha.pontosDeVidaMax ? (
          <div className="mt-3 h-2 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-danger to-gold transition-all"
              style={{ width: `${Math.max(0, Math.min(100, ((ficha.pontosDeVidaAtual ?? 0) / ficha.pontosDeVidaMax) * 100))}%` }}
            />
          </div>
        ) : null}
      </div>

      {/* Other combat stats */}
      <div className="flex flex-wrap gap-3">
        <StatInput label="Classe de Armadura" value={ficha.classeDeArmadura} icon={<Shield className="h-5 w-5" />} onSave={v => onSave({ classeDeArmadura: v })} />
        <StatInput label="Iniciativa" value={ficha.iniciativa} min={-10} icon={<Zap className="h-5 w-5" />} onSave={v => onSave({ iniciativa: v })} />
        <StatInput label="Deslocamento (m)" value={ficha.deslocamento} icon={<Wind className="h-5 w-5" />} onSave={v => onSave({ deslocamento: v })} />
        <StatInput label="Bônus de Proficiência" value={ficha.bonusDeProficiencia} onSave={v => onSave({ bonusDeProficiencia: v })} />
      </div>

      {/* Dado de vida */}
      <div className="flex items-center gap-3">
        <Dice6 className="h-4 w-4 text-gold" />
        <label className="text-sm font-inter text-muted-rpg">Dado de Vida:</label>
        <select
          value={ficha.dadoDeVida ?? "d8"}
          aria-label="Dado de vida"
          onChange={e => onSave({ dadoDeVida: e.target.value })}
          className="rounded border border-rpg bg-surface px-2 py-1 text-sm text-parchment focus:border-gold outline-none"
        >
          {["d4", "d6", "d8", "d10", "d12"].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Death saves */}
      <div className="rounded-lg border border-rpg bg-background p-4 parchment">
        <h3 className="font-cinzel text-sm font-semibold text-parchment mb-3">Testes de Morte</h3>
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-muted-rpg font-inter mb-2">Sucessos</p>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-4 w-4 rounded-full border border-gold/40 bg-gold/5" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-rpg font-inter mb-2">Falhas</p>
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-4 w-4 rounded-full border border-danger/40 bg-danger/5" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
