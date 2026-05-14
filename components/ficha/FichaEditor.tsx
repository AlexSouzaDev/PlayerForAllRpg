"use client";

import { useState } from "react";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useFichaAutoSave } from "@/hooks/useFicha";
import { IdentidadeSection } from "./sections/IdentidadeSection";
import { AtributosSection } from "./sections/AtributosSection";
import { CombateSection } from "./sections/CombateSection";
import { HabilidadesSection } from "./sections/HabilidadesSection";
import { InventarioSection } from "./sections/InventarioSection";
import { MagiasSection } from "./sections/MagiasSection";
import { HistoriaSection } from "./sections/HistoriaSection";
import { GenericoSection } from "./sections/GenericoSection";
import type { FichaCompleta } from "@/types/ficha";
import { cn } from "@/lib/utils";

type Tab = "identidade" | "atributos" | "combate" | "habilidades" | "inventario" | "magias" | "historia" | "notas";

const TABS_DND: { id: Tab; label: string }[] = [
  { id: "identidade", label: "Identidade" },
  { id: "atributos", label: "Atributos" },
  { id: "combate", label: "Combate" },
  { id: "habilidades", label: "Habilidades" },
  { id: "inventario", label: "Inventário" },
  { id: "magias", label: "Magias" },
  { id: "historia", label: "História" },
  { id: "notas", label: "Notas" },
];

const TABS_GENERIC = [
  TABS_DND[0],
  TABS_DND[7],
  { id: "notas" as Tab, label: "Campos Extras" },
];

interface Props {
  fichaId: string;
}

export function FichaEditor({ fichaId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("identidade");
  const { data: ficha, isLoading, isError } = trpc.ficha.getById.useQuery({ id: fichaId });
  const utils = trpc.useUtils();
  const { save, isSaving, isError: saveError, isSuccess } = useFichaAutoSave(fichaId);

  const uploadImageMutation = trpc.ficha.uploadImage.useMutation({
    onSuccess: () => utils.ficha.getById.invalidate({ id: fichaId }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
      </div>
    );
  }

  if (isError || !ficha) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-danger">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="font-lora">Ficha não encontrada</p>
      </div>
    );
  }

  const fichaTyped = ficha as unknown as FichaCompleta;
  const isDnD = ficha.sistema === "dnd5e";
  const tabs = isDnD ? TABS_DND : TABS_GENERIC;

  const handleSave = (data: Partial<FichaCompleta>) => save(data as Record<string, unknown>);

  const renderSection = () => {
    switch (activeTab) {
      case "identidade": return <IdentidadeSection ficha={fichaTyped} onSave={handleSave} onImageUpload={url => uploadImageMutation.mutate({ id: fichaId, imageUrl: url })} />;
      case "atributos": return <AtributosSection ficha={fichaTyped} onSave={handleSave} />;
      case "combate": return <CombateSection ficha={fichaTyped} onSave={handleSave} />;
      case "habilidades": return <HabilidadesSection ficha={fichaTyped} onSave={handleSave} />;
      case "inventario": return <InventarioSection ficha={fichaTyped} onSave={handleSave} />;
      case "magias": return <MagiasSection ficha={fichaTyped} onSave={handleSave} />;
      case "historia": return <HistoriaSection ficha={fichaTyped} onSave={handleSave} />;
      case "notas": return isDnD
        ? <div className="p-4"><label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-2">Notas</label><textarea rows={12} value={ficha.notas ?? ""} onChange={e => handleSave({ notas: e.target.value })} className="w-full rounded border border-rpg bg-background px-3 py-2 text-sm text-parchment font-lora focus:border-gold outline-none resize-none" /></div>
        : <GenericoSection ficha={fichaTyped} onSave={handleSave} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-rpg px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-cinzel font-bold text-xl text-parchment">{ficha.nomePersonagem}</h1>
          <p className="text-xs text-muted-rpg font-inter mt-0.5">
            {[ficha.raca, ficha.classe, ficha.nivel ? `Nível ${ficha.nivel}` : null].filter(Boolean).join(" • ")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-inter">
          {isSaving && <><Loader2 className="h-3.5 w-3.5 text-muted-rpg animate-spin" /> <span className="text-muted-rpg">Salvando...</span></>}
          {!isSaving && isSuccess && <><CheckCircle className="h-3.5 w-3.5 text-gold" /> <span className="text-gold">Salvo</span></>}
          {saveError && <><AlertCircle className="h-3.5 w-3.5 text-danger" /> <span className="text-danger">Erro ao salvar</span></>}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex overflow-x-auto border-b border-rpg scrollbar-hide"
        role="tablist"
        aria-label="Seções da ficha"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-shrink-0 px-4 py-3 text-sm font-inter transition-all border-b-2 -mb-[1px]",
              activeTab === tab.id
                ? "border-gold text-gold tab-active-glow"
                : "border-transparent text-muted-rpg hover:text-parchment hover:border-rpg"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" role="tabpanel">
        {renderSection()}
      </div>
    </div>
  );
}
