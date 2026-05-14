"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Scroll, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { FichaCard } from "@/components/ficha/FichaCard";
import { Button } from "@/components/ui/button";
import { SISTEMAS } from "@/types/systems";

function SystemModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (nome: string, sistema: string) => void;
}) {
  const [nome, setNome] = useState("");
  const [sistema, setSistema] = useState("dnd5e");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-rpg bg-surface p-6 mx-4 parchment">
        <h2 className="font-cinzel font-bold text-xl text-parchment mb-4">Nova Ficha</h2>

        <div className="flex flex-col gap-3 mb-4">
          <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider">
            Nome do Personagem
          </label>
          <input
            autoFocus
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Nome do seu personagem..."
            className="flex h-10 w-full rounded border border-rpg bg-background px-3 py-2 text-sm text-parchment placeholder:text-muted-rpg focus:border-gold focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="text-xs font-inter text-muted-rpg uppercase tracking-wider mb-1">Sistema</label>
          {SISTEMAS.map(s => (
            <button
              key={s.id}
              onClick={() => setSistema(s.id)}
              className={`flex items-start gap-3 rounded border p-3 text-left transition-colors ${
                sistema === s.id
                  ? "border-gold bg-gold/5 text-parchment"
                  : "border-rpg bg-background text-muted-rpg hover:border-gold/30"
              }`}
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="font-cinzel font-semibold text-sm">{s.nome}</p>
                <p className="text-xs mt-0.5 font-lora">{s.descricao}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button
            className="flex-1"
            disabled={!nome.trim()}
            onClick={() => nome.trim() && onCreate(nome, sistema)}
          >
            Criar Ficha
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FichasPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { data: fichas, isLoading, refetch } = trpc.ficha.list.useQuery();
  const createMutation = trpc.ficha.create.useMutation({
    onSuccess: (ficha) => {
      setShowModal(false);
      router.push(`/fichas/${ficha.id}`);
    },
  });

  const handleCreate = (nome: string, sistema: string) => {
    createMutation.mutate({ nomePersonagem: nome, sistema });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel font-bold text-3xl text-parchment">Minhas Fichas</h1>
            <p className="text-muted-rpg font-lora mt-1">
              {fichas?.length ?? 0} personagem{fichas?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Nova Ficha
          </Button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          </div>
        )}

        {!isLoading && fichas?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Scroll className="h-16 w-16 text-muted-rpg mb-6 opacity-40" />
            <h2 className="font-cinzel font-bold text-2xl text-parchment mb-2">Nenhuma ficha ainda</h2>
            <p className="text-muted-rpg font-lora mb-8 max-w-sm">
              Crie sua primeira ficha de personagem e comece sua aventura.
            </p>
            <Button onClick={() => setShowModal(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" /> Criar primeira ficha
            </Button>
          </div>
        )}

        {fichas && fichas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fichas.map(ficha => (
              <FichaCard key={ficha.id} ficha={ficha} onDelete={() => refetch()} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SystemModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
