import Link from "next/link";
import { Sword, Share2, FileDown, Layers, Shield, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockFicha = {
  nome: "Gandalf, o Cinzento",
  raca: "Maia",
  classe: "Mago",
  nivel: 20,
  forca: 10, destreza: 14, constituicao: 16,
  inteligencia: 22, sabedoria: 20, carisma: 18,
};

function StatBlock({ attr, value }: { attr: string; value: number }) {
  const mod = Math.floor((value - 10) / 2);
  return (
    <div className="flex flex-col items-center rounded border border-rpg bg-surface p-3 parchment min-w-[72px]">
      <span className="text-xs font-inter text-muted-rpg uppercase tracking-wider">{attr}</span>
      <span className="text-2xl font-cinzel font-bold text-parchment mt-1">{value}</span>
      <span className="text-sm font-lora text-gold">{mod >= 0 ? `+${mod}` : mod}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-parchment">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-rpg max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sword className="h-6 w-6 text-gold" />
          <span className="font-cinzel font-bold text-xl">
            Player<span className="text-gold">For</span>AllRPG
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="ghost">Entrar</Button></Link>
          <Link href="/register"><Button>Criar conta grátis</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-sm text-gold font-inter mb-6">
          <Star className="h-3.5 w-3.5" /> Para todos os sistemas de RPG
        </div>
        <h1 className="font-cinzel font-black text-5xl md:text-7xl leading-tight mb-6">
          Sua ficha de{" "}
          <span className="text-gold-gradient">personagem</span>,{" "}
          em qualquer sistema, sempre com você.
        </h1>
        <p className="text-xl text-muted-rpg font-lora max-w-2xl mb-10 leading-relaxed">
          Crie fichas completas para D&D 5e, sistemas genéricos e muito mais. Compartilhe com seu grupo,
          exporte em PDF e jogue em qualquer lugar.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register">
            <Button size="lg" className="min-w-48">Criar conta grátis</Button>
          </Link>
          <Link href="/p/gandalf-o-cinzento-demo">
            <Button size="lg" variant="outline" className="min-w-48">Ver exemplo</Button>
          </Link>
        </div>
      </section>

      {/* Preview Card */}
      <section className="max-w-2xl mx-auto px-6 mb-24">
        <div className="rounded-xl border border-gold/20 bg-surface p-6 shadow-2xl shadow-gold/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-arcane/20 flex items-center justify-center text-3xl">🧙</div>
            <div>
              <h2 className="font-cinzel font-bold text-2xl text-parchment">{mockFicha.nome}</h2>
              <p className="text-muted-rpg font-lora">{mockFicha.raca} • {mockFicha.classe} • Nível {mockFicha.nivel}</p>
            </div>
            <span className="ml-auto text-xs font-inter bg-gold/10 border border-gold/30 text-gold rounded px-2 py-1">D&D 5e</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <StatBlock attr="FOR" value={mockFicha.forca} />
            <StatBlock attr="DES" value={mockFicha.destreza} />
            <StatBlock attr="CON" value={mockFicha.constituicao} />
            <StatBlock attr="INT" value={mockFicha.inteligencia} />
            <StatBlock attr="SAB" value={mockFicha.sabedoria} />
            <StatBlock attr="CAR" value={mockFicha.carisma} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-cinzel font-bold text-3xl text-center mb-12">
          Tudo que um <span className="text-gold">aventureiro</span> precisa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Layers, title: "Multi-sistema", desc: "D&D 5e completo com atributos, magias, habilidades. Ou crie campos personalizados para qualquer outro sistema." },
            { icon: Share2, title: "Compartilhe", desc: "Gere um link público e deixe sua mesa ver sua ficha em tempo real. Leitura para todos, edição só para você." },
            { icon: FileDown, title: "Export PDF", desc: "Exporte sua ficha como PDF estilizado, pronto para imprimir ou salvar offline. Com visual de ficha clássica." },
            { icon: Zap, title: "Auto-save", desc: "Suas mudanças são salvas automaticamente. Nunca perca progresso, mesmo se fechar o navegador." },
            { icon: Shield, title: "Combate completo", desc: "HP, CA, iniciativa, dados de vida, testes de resistência e muito mais. Tudo num só lugar." },
            { icon: Star, title: "História & Notas", desc: "Espaço para o passado, personalidade, ideais e anotações de campanha. RPG é narrativa." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-rpg bg-surface p-5 hover:border-gold/30 transition-colors">
              <Icon className="h-8 w-8 text-gold mb-3" />
              <h3 className="font-cinzel font-semibold text-parchment mb-2">{title}</h3>
              <p className="text-sm text-muted-rpg font-lora leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-rpg bg-surface py-20 text-center px-6">
        <h2 className="font-cinzel font-bold text-4xl mb-4">Pronto para jogar?</h2>
        <p className="text-muted-rpg font-lora mb-8 text-lg">Crie sua conta grátis e comece a montar sua ficha agora.</p>
        <Link href="/register">
          <Button size="lg">Começar agora — é grátis</Button>
        </Link>
      </section>

      <footer className="border-t border-rpg py-6 text-center text-sm text-muted-rpg font-inter">
        © 2025 PlayerForAllRPG — Feito com ♥ para a comunidade RPG
      </footer>
    </div>
  );
}
