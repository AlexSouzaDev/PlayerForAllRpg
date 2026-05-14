"use client";

import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useUploadThing } from "@/lib/uploadthing";
import { RACAS_DND, CLASSES_DND, ANTECEDENTES_DND, ALINHAMENTOS } from "@/types/systems";
import type { FichaCompleta } from "@/types/ficha";

interface Props {
  ficha: FichaCompleta;
  onSave: (data: Partial<FichaCompleta>) => void;
  onImageUpload: (url: string) => void;
}

function FieldInput({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded border border-rpg bg-background px-2 py-1.5 text-sm text-parchment font-lora focus:border-gold outline-none transition-colors"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={label}
        className="w-full rounded border border-rpg bg-background px-2 py-1.5 text-sm text-parchment font-lora focus:border-gold outline-none transition-colors"
      >
        <option value="">— Selecionar —</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function IdentidadeSection({ ficha, onSave, onImageUpload }: Props) {
  const { startUpload, isUploading } = useUploadThing("fichaImage", {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.url) onImageUpload(res[0].url);
    },
  });

  const isDnD = ficha.sistema === "dnd5e";

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Image upload */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-2">Imagem</label>
          <label
            htmlFor="image-upload"
            className="relative block h-32 w-32 rounded-lg border border-rpg bg-background cursor-pointer overflow-hidden hover:border-gold/30 transition-colors group"
            aria-label="Fazer upload de imagem do personagem"
          >
            {ficha.imageUrl ? (
              <Image src={ficha.imageUrl} alt={ficha.nomePersonagem} fill className="object-cover" />
            ) : (
              <Avatar name={ficha.nomePersonagem} size="xl" className="absolute inset-0 w-full h-full rounded-none" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) startUpload([file]);
              }}
            />
          </label>
          <p className="text-xs text-muted-rpg font-inter mt-1">JPEG/PNG/WEBP, max 4MB</p>
        </div>

        {/* Identity fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="col-span-full">
            <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">Nome do Personagem</label>
            <input
              value={ficha.nomePersonagem}
              onChange={e => onSave({ nomePersonagem: e.target.value })}
              placeholder="Nome do personagem"
              aria-label="Nome do personagem"
              className="w-full rounded border border-rpg bg-background px-3 py-2 text-xl font-cinzel font-bold text-parchment focus:border-gold outline-none transition-colors"
            />
          </div>

          {isDnD ? (
            <>
              <SelectField label="Raça" value={ficha.raca ?? ""} onChange={v => onSave({ raca: v })} options={RACAS_DND} />
              <SelectField label="Classe" value={ficha.classe ?? ""} onChange={v => onSave({ classe: v })} options={CLASSES_DND} />
              <FieldInput label="Subclasse" value={ficha.subclasse ?? ""} onChange={v => onSave({ subclasse: v })} placeholder="Escola de Magia, Juramento..." />
              <div>
                <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">Nível</label>
                <input
                  type="number" min={1} max={20}
                  value={ficha.nivel ?? 1}
                  onChange={e => onSave({ nivel: parseInt(e.target.value) || 1 })}
                  aria-label="Nível"
                  className="w-full rounded border border-rpg bg-background px-2 py-1.5 text-sm text-parchment font-lora focus:border-gold outline-none"
                />
              </div>
              <SelectField label="Antecedente" value={ficha.antecedente ?? ""} onChange={v => onSave({ antecedente: v })} options={ANTECEDENTES_DND} />
              <SelectField label="Alinhamento" value={ficha.alinhamento ?? ""} onChange={v => onSave({ alinhamento: v })} options={ALINHAMENTOS} />
              <div>
                <label className="block text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">XP</label>
                <input
                  type="number" min={0}
                  value={ficha.xp ?? 0}
                  onChange={e => onSave({ xp: parseInt(e.target.value) || 0 })}
                  aria-label="Pontos de Experiência"
                  className="w-full rounded border border-rpg bg-background px-2 py-1.5 text-sm text-parchment font-lora focus:border-gold outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <FieldInput label="Classe / Tipo" value={ficha.classe ?? ""} onChange={v => onSave({ classe: v })} placeholder="Vampiro, Investigador..." />
              <FieldInput label="Raça / Clã / Origem" value={ficha.raca ?? ""} onChange={v => onSave({ raca: v })} placeholder="Ventrue, Humano..." />
              <FieldInput label="Subclasse / Disciplina" value={ficha.subclasse ?? ""} onChange={v => onSave({ subclasse: v })} />
              <FieldInput label="Nível / Geração" value={String(ficha.nivel ?? "")} onChange={v => onSave({ nivel: parseInt(v) || undefined })} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
