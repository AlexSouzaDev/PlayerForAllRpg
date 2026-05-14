"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit2, Share2, FileDown, Trash2, Copy, Globe, Lock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { useState } from "react";

interface FichaCardProps {
  ficha: {
    id: string;
    slug: string;
    nomePersonagem: string;
    sistema: string;
    imageUrl?: string | null;
    classe?: string | null;
    nivel?: number | null;
    isPublic: boolean;
    updatedAt: Date;
  };
  onDelete: () => void;
}

export function FichaCard({ ficha, onDelete }: FichaCardProps) {
  const [copied, setCopied] = useState(false);
  const togglePublic = trpc.ficha.togglePublic.useMutation({ onSuccess: () => onDelete() });
  const deleteMutation = trpc.ficha.delete.useMutation({ onSuccess: onDelete });
  const duplicate = trpc.ficha.duplicate.useMutation({ onSuccess: () => onDelete() });

  const shareUrl = `${window.location.origin}/p/${ficha.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const systemLabel = ficha.sistema === "dnd5e" ? "D&D 5e" : ficha.sistema === "generico" ? "Genérico" : ficha.sistema;

  return (
    <div className="group rounded-xl border border-rpg bg-surface hover:border-gold/30 transition-all duration-200 overflow-hidden parchment">
      {/* Image header */}
      <div className="relative h-28 bg-gradient-to-br from-arcane/10 to-gold/5">
        {ficha.imageUrl ? (
          <Image src={ficha.imageUrl} alt={ficha.nomePersonagem} fill className="object-cover opacity-70" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar name={ficha.nomePersonagem} size="lg" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant={ficha.sistema === "dnd5e" ? "gold" : "arcane"}>{systemLabel}</Badge>
        </div>
        <div className="absolute top-2 left-2">
          {ficha.isPublic ? (
            <Globe className="h-4 w-4 text-gold" aria-label="Público" />
          ) : (
            <Lock className="h-4 w-4 text-muted-rpg" aria-label="Privado" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-cinzel font-bold text-parchment text-base line-clamp-1">{ficha.nomePersonagem}</h3>
        <p className="text-sm text-muted-rpg font-lora mt-0.5">
          {[ficha.classe, ficha.nivel ? `Nível ${ficha.nivel}` : null].filter(Boolean).join(" • ") || "—"}
        </p>
        <p className="text-xs text-muted-rpg font-inter mt-2">
          Atualizado {formatDistanceToNow(new Date(ficha.updatedAt), { locale: ptBR, addSuffix: true })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-1 px-4 pb-4">
        <Link href={`/fichas/${ficha.id}`} className="flex-1">
          <Button variant="gold" size="sm" className="w-full gap-1">
            <Edit2 className="h-3.5 w-3.5" /> Editar
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => togglePublic.mutate({ id: ficha.id })}
          aria-label="Alternar visibilidade"
        >
          {ficha.isPublic ? <Lock className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
        </Button>
        {ficha.isPublic && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLink} aria-label="Copiar link">
            <Share2 className={`h-3.5 w-3.5 ${copied ? "text-gold" : ""}`} />
          </Button>
        )}
        <Link href={`/fichas/${ficha.id}/pdf`} target="_blank">
          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Exportar PDF">
            <FileDown className="h-3.5 w-3.5" />
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => duplicate.mutate({ id: ficha.id })}
          aria-label="Duplicar ficha"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:text-danger"
          onClick={() => { if (confirm("Excluir esta ficha?")) deleteMutation.mutate({ id: ficha.id }); }}
          aria-label="Excluir ficha"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
