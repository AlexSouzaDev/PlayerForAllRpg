"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import type { FichaCompleta, MagiasData, Magia, SlotsMagia } from "@/types/ficha";

const defaultSlots: SlotsMagia = {
  nivel1: { total: 0, usados: 0 }, nivel2: { total: 0, usados: 0 },
  nivel3: { total: 0, usados: 0 }, nivel4: { total: 0, usados: 0 },
  nivel5: { total: 0, usados: 0 }, nivel6: { total: 0, usados: 0 },
  nivel7: { total: 0, usados: 0 }, nivel8: { total: 0, usados: 0 },
  nivel9: { total: 0, usados: 0 },
};

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

export function MagiasSection({ ficha, onSave }: Props) {
  const magias: MagiasData = (ficha.magias as MagiasData | null) ?? { slots: defaultSlots, lista: [] };
  const [newSpell, setNewSpell] = useState<Partial<Magia>>({ nome: "", nivel: 0, concentracao: false, ritual: false, preparada: false });

  const save = (updated: MagiasData) => onSave({ magias: updated });

  const addSpell = () => {
    if (!newSpell.nome?.trim()) return;
    save({
      ...magias,
      lista: [...magias.lista, {
        id: nanoid(),
        nome: newSpell.nome,
        nivel: newSpell.nivel ?? 0,
        concentracao: newSpell.concentracao ?? false,
        ritual: newSpell.ritual ?? false,
        preparada: newSpell.preparada ?? false,
        escola: newSpell.escola,
        descricao: newSpell.descricao,
      }],
    });
    setNewSpell({ nome: "", nivel: 0, concentracao: false, ritual: false, preparada: false });
  };

  const removeSpell = (id: string) => save({ ...magias, lista: magias.lista.filter(s => s.id !== id) });
  const togglePrepared = (id: string) => save({ ...magias, lista: magias.lista.map(s => s.id === id ? { ...s, preparada: !s.preparada } : s) });

  const updateSlot = (key: keyof SlotsMagia, field: "total" | "usados", val: number) =>
    save({ ...magias, slots: { ...magias.slots, [key]: { ...magias.slots[key], [field]: Math.max(0, val) } } });

  const slotLevels = Object.entries(magias.slots) as [keyof SlotsMagia, { total: number; usados: number }][];

  return (
    <div className="p-4 space-y-6">
      <h2 className="font-cinzel font-semibold text-parchment">Magias</h2>

      {/* Spell stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-rpg bg-background p-3 text-center parchment">
          <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">Atrib.</label>
          <select
            value={magias.atributo ?? ""}
            onChange={e => save({ ...magias, atributo: e.target.value })}
            className="block w-full mt-1 text-sm font-cinzel text-parchment bg-transparent border-none outline-none text-center"
          >
            <option value="">—</option>
            {["Inteligência", "Sabedoria", "Carisma"].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="rounded-lg border border-rpg bg-background p-3 text-center parchment">
          <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">CD Magia</label>
          <input
            type="number"
            value={magias.cd ?? 0}
            onChange={e => save({ ...magias, cd: parseInt(e.target.value) || 0 })}
            className="block w-full mt-1 text-xl font-cinzel text-parchment bg-transparent border-none outline-none text-center"
          />
        </div>
        <div className="rounded-lg border border-rpg bg-background p-3 text-center parchment">
          <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">Bônus Ataque</label>
          <input
            type="number"
            value={magias.bonus ?? 0}
            onChange={e => save({ ...magias, bonus: parseInt(e.target.value) || 0 })}
            className="block w-full mt-1 text-xl font-cinzel text-parchment bg-transparent border-none outline-none text-center"
          />
        </div>
      </div>

      {/* Spell slots */}
      <div>
        <h3 className="font-cinzel text-sm font-semibold text-parchment mb-3">Espaços de Magia</h3>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {slotLevels.map(([key, slot]) => {
            const level = parseInt(key.replace("nivel", ""));
            return (
              <div key={key} className="flex flex-col items-center rounded border border-rpg bg-background p-2">
                <span className="text-xs font-inter text-muted-rpg mb-1">{level}°</span>
                <div className="flex flex-wrap gap-1 justify-center min-h-[20px]">
                  {Array.from({ length: slot.total }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateSlot(key, "usados", i < slot.usados ? i : i + 1)}
                      aria-label={`Slot nível ${level} ${i + 1}`}
                      className={`h-3 w-3 rounded-full border transition-colors ${i < slot.usados ? "bg-arcane/30 border-arcane/40" : "bg-arcane border-arcane"}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  <input
                    type="number" min={0} max={9} value={slot.total}
                    onChange={e => updateSlot(key, "total", parseInt(e.target.value) || 0)}
                    className="w-8 text-center text-xs text-parchment bg-transparent border-b border-rpg outline-none focus:border-gold"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add spell */}
      <div className="rounded-lg border border-rpg bg-background p-3">
        <h3 className="font-cinzel text-sm font-semibold text-parchment mb-2">Adicionar Magia</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <input
            className="col-span-2 rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold outline-none"
            placeholder="Nome da magia"
            value={newSpell.nome ?? ""}
            onChange={e => setNewSpell(p => ({ ...p, nome: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addSpell()}
          />
          <select
            value={newSpell.nivel ?? 0}
            onChange={e => setNewSpell(p => ({ ...p, nivel: parseInt(e.target.value) }))}
            className="rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment focus:border-gold outline-none"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n === 0 ? "Truque" : `${n}° nível`}</option>)}
          </select>
          <input
            className="rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold outline-none"
            placeholder="Escola"
            value={newSpell.escola ?? ""}
            onChange={e => setNewSpell(p => ({ ...p, escola: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-4 mb-2">
          {(["concentracao", "ritual", "preparada"] as const).map(flag => (
            <label key={flag} className="flex items-center gap-1.5 text-xs font-inter text-muted-rpg cursor-pointer">
              <input
                type="checkbox"
                checked={!!(newSpell[flag])}
                onChange={e => setNewSpell(p => ({ ...p, [flag]: e.target.checked }))}
                className="accent-gold"
              />
              {flag === "concentracao" ? "Concentração" : flag === "ritual" ? "Ritual" : "Preparada"}
            </label>
          ))}
          <Button size="sm" onClick={addSpell} disabled={!newSpell.nome?.trim()} className="ml-auto" aria-label="Adicionar magia">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Spell list */}
      {magias.lista.length === 0 ? (
        <div className="text-center py-8 text-muted-rpg">
          <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-lora">Nenhuma magia ainda</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {[...Array(10)].map((_, nivel) => {
            const feiticos = magias.lista.filter(s => s.nivel === nivel);
            if (!feiticos.length) return null;
            return (
              <div key={nivel}>
                <p className="text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">
                  {nivel === 0 ? "Truques" : `${nivel}° Nível`}
                </p>
                {feiticos.map(spell => (
                  <div
                    key={spell.id}
                    className={`flex items-center gap-2 rounded border px-3 py-2 mb-1 transition-colors ${spell.preparada ? "border-arcane/30 bg-arcane/5" : "border-rpg bg-background"}`}
                  >
                    <button
                      onClick={() => togglePrepared(spell.id)}
                      aria-label={`${spell.preparada ? "Desmarcar" : "Marcar"} ${spell.nome} como preparada`}
                      className={`h-3.5 w-3.5 rounded-sm border flex-shrink-0 ${spell.preparada ? "bg-arcane border-arcane" : "border-muted"}`}
                    />
                    <span className="flex-1 text-sm font-lora text-parchment">{spell.nome}</span>
                    {spell.concentracao && <span className="text-xs text-arcane font-inter">C</span>}
                    {spell.ritual && <span className="text-xs text-gold font-inter">R</span>}
                    {spell.escola && <span className="text-xs text-muted-rpg font-inter">{spell.escola}</span>}
                    <button onClick={() => removeSpell(spell.id)} aria-label={`Remover ${spell.nome}`} className="text-muted-rpg hover:text-danger transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
