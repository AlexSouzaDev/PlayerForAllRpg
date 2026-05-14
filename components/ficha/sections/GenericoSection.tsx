"use client";

import { useState } from "react";
import { Plus, Trash2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import type { FichaCompleta, CampoPersonalizado } from "@/types/ficha";

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

export function GenericoSection({ ficha, onSave }: Props) {
  const campos: CampoPersonalizado[] = (ficha.camposPersonalizados as CampoPersonalizado[] | null) ?? [];
  const [newChave, setNewChave] = useState("");

  const save = (updated: CampoPersonalizado[]) => onSave({ camposPersonalizados: updated });

  const addCampo = () => {
    if (!newChave.trim()) return;
    save([...campos, { id: nanoid(), chave: newChave.trim(), valor: "" }]);
    setNewChave("");
  };

  const update = (id: string, field: "chave" | "valor", value: string) =>
    save(campos.map(c => c.id === id ? { ...c, [field]: value } : c));

  const remove = (id: string) => save(campos.filter(c => c.id !== id));

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-cinzel font-semibold text-parchment">Campos Personalizados</h2>
      </div>

      <p className="text-sm text-muted-rpg font-lora mb-4">
        Adicione qualquer campo necessário para o seu sistema de RPG. Ideal para Vampiro: A Máscara, Call of Cthulhu, etc.
      </p>

      {/* Add field */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold outline-none"
          placeholder="Nome do campo (ex: Humanidade, Geração, Força de Vontade...)"
          value={newChave}
          onChange={e => setNewChave(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCampo()}
        />
        <Button size="sm" onClick={addCampo} disabled={!newChave.trim()} aria-label="Adicionar campo">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {campos.length === 0 ? (
        <div className="text-center py-10 text-muted-rpg">
          <LayoutGrid className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-lora">Nenhum campo personalizado ainda</p>
        </div>
      ) : (
        <div className="space-y-2">
          {campos.map(campo => (
            <div key={campo.id} className="flex items-start gap-2">
              <input
                className="w-40 flex-shrink-0 rounded border border-rpg bg-background px-2 py-1.5 text-sm font-cinzel text-gold focus:border-gold outline-none"
                value={campo.chave}
                onChange={e => update(campo.id, "chave", e.target.value)}
                aria-label="Nome do campo"
              />
              <input
                className="flex-1 rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment font-lora focus:border-gold outline-none"
                value={campo.valor}
                onChange={e => update(campo.id, "valor", e.target.value)}
                placeholder="Valor"
                aria-label={`Valor de ${campo.chave}`}
              />
              <button
                onClick={() => remove(campo.id)}
                aria-label={`Remover ${campo.chave}`}
                className="mt-1.5 text-muted-rpg hover:text-danger transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="mt-6">
        <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1.5">Notas Gerais</label>
        <textarea
          rows={5}
          value={ficha.notas ?? ""}
          onChange={e => onSave({ notas: e.target.value })}
          placeholder="Anotações livres, mecânicas especiais, habilidades únicas..."
          className="w-full rounded border border-rpg bg-background px-3 py-2 text-sm text-parchment font-lora placeholder:text-muted-rpg focus:border-gold focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}
