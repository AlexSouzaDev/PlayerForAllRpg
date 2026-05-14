"use client";

import { useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import type { FichaCompleta, InventarioItem } from "@/types/ficha";

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
}

export function InventarioSection({ ficha, onSave }: Props) {
  const items: InventarioItem[] = (ficha.inventario as InventarioItem[] | null) ?? [];
  const [newItem, setNewItem] = useState({ nome: "", quantidade: 1, peso: 0, descricao: "" });

  const save = (updated: InventarioItem[]) => onSave({ inventario: updated });

  const addItem = () => {
    if (!newItem.nome.trim()) return;
    save([...items, { id: nanoid(), equipado: false, ...newItem }]);
    setNewItem({ nome: "", quantidade: 1, peso: 0, descricao: "" });
  };

  const removeItem = (id: string) => save(items.filter(i => i.id !== id));
  const toggleEquipado = (id: string) => save(items.map(i => i.id === id ? { ...i, equipado: !i.equipado } : i));
  const updateItem = (id: string, field: keyof InventarioItem, value: unknown) =>
    save(items.map(i => i.id === id ? { ...i, [field]: value } : i));

  const totalPeso = items.reduce((acc, i) => acc + (i.peso ?? 0) * i.quantidade, 0);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-cinzel font-semibold text-parchment">Inventário</h2>
          <p className="text-xs text-muted-rpg font-inter mt-0.5">Peso total: {totalPeso} kg</p>
        </div>
        <span className="text-sm font-inter text-muted-rpg">{items.length} itens</span>
      </div>

      {/* Add item form */}
      <div className="rounded-lg border border-rpg bg-background p-3 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          <input
            className="col-span-2 rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold outline-none"
            placeholder="Nome do item"
            value={newItem.nome}
            onChange={e => setNewItem(p => ({ ...p, nome: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && addItem()}
          />
          <input
            type="number"
            min={1}
            className="rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment focus:border-gold outline-none"
            placeholder="Qtd"
            value={newItem.quantidade}
            onChange={e => setNewItem(p => ({ ...p, quantidade: parseInt(e.target.value) || 1 }))}
          />
          <input
            type="number"
            min={0}
            step={0.1}
            className="rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment focus:border-gold outline-none"
            placeholder="Peso (kg)"
            value={newItem.peso}
            onChange={e => setNewItem(p => ({ ...p, peso: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border border-rpg bg-surface px-2 py-1.5 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold outline-none"
            placeholder="Descrição (opcional)"
            value={newItem.descricao}
            onChange={e => setNewItem(p => ({ ...p, descricao: e.target.value }))}
          />
          <Button size="sm" onClick={addItem} disabled={!newItem.nome.trim()} aria-label="Adicionar item">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-10 text-muted-rpg">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-lora">Inventário vazio</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {items.map(item => (
            <div key={item.id} className={`flex items-center gap-2 rounded border px-3 py-2 transition-colors ${item.equipado ? "border-gold/30 bg-gold/5" : "border-rpg bg-background"}`}>
              <button
                onClick={() => toggleEquipado(item.id)}
                aria-label={`${item.equipado ? "Desequipar" : "Equipar"} ${item.nome}`}
                className={`h-4 w-4 rounded-sm border flex-shrink-0 transition-colors ${item.equipado ? "bg-gold border-gold" : "border-muted"}`}
              />
              <span className="flex-1 text-sm font-lora text-parchment">{item.nome}</span>
              <input
                type="number"
                min={1}
                value={item.quantidade}
                aria-label={`Quantidade de ${item.nome}`}
                onChange={e => updateItem(item.id, "quantidade", parseInt(e.target.value) || 1)}
                className="w-14 text-center text-sm text-parchment bg-transparent border border-rpg rounded px-1 py-0.5 focus:border-gold outline-none"
              />
              <span className="text-xs text-muted-rpg font-inter w-14 text-right">{(item.peso ?? 0) * item.quantidade}kg</span>
              <button onClick={() => removeItem(item.id)} aria-label={`Remover ${item.nome}`} className="text-muted-rpg hover:text-danger transition-colors ml-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
