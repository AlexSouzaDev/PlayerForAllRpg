import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("demo1234", 12);

  const user = await db.user.upsert({
    where: { email: "demo@playerforallrpg.com" },
    update: {},
    create: {
      email: "demo@playerforallrpg.com",
      name: "Demo User",
      password: hash,
    },
  });

  console.log("✅ Demo user:", user.email);

  // D&D 5e ficha — Gandalf
  const gandalf = await db.ficha.upsert({
    where: { slug: "gandalf-o-cinzento-demo" },
    update: {},
    create: {
      slug: "gandalf-o-cinzento-demo",
      userId: user.id,
      nomePersonagem: "Gandalf, o Cinzento",
      sistema: "dnd5e",
      raca: "Humano",
      classe: "Mago",
      subclasse: "Escola de Evocação",
      nivel: 20,
      antecedente: "Sábio",
      alinhamento: "Neutro Bom",
      xp: 355000,
      forca: 10,
      destreza: 14,
      constituicao: 16,
      inteligencia: 22,
      sabedoria: 20,
      carisma: 18,
      pontosDeVidaMax: 120,
      pontosDeVidaAtual: 120,
      classeDeArmadura: 14,
      iniciativa: 2,
      deslocamento: 9,
      bonusDeProficiencia: 6,
      dadoDeVida: "d6",
      historia: "Gandalf é um Maia, um ser espiritual enviado às Terras Médias como um Istari (mago) para ajudar os habitantes livres a resistir ao poder de Sauron. Ele aparece como um velho com um chapéu cinzento e uma longa capa, e carrega o anel élfigo Narya, um dos Três. Sua sabedoria é lendária e sua magia é capaz de feitos extraordinários.",
      tracos: {
        tracoPersonalidade: "Sou incrivelmente astuto e raramente mostro meu poder completo.",
        ideal: "O bem maior. Cada vida importa na luta contra as trevas.",
        vinculo: "As terras livres da Terra Média devem ser protegidas a qualquer custo.",
        fraqueza: "Minha natureza contemplativa às vezes me faz chegar tarde demais.",
      },
      habilidades: {
        savingThrows: [
          { atributo: "forca", proficiente: false },
          { atributo: "destreza", proficiente: false },
          { atributo: "constituicao", proficiente: false },
          { atributo: "inteligencia", proficiente: true },
          { atributo: "sabedoria", proficiente: true },
          { atributo: "carisma", proficiente: false },
        ],
        habilidades: [
          { nome: "Acrobacia", atributo: "destreza", proficiente: false, expertise: false },
          { nome: "Arcanismo", atributo: "inteligencia", proficiente: true, expertise: true },
          { nome: "Atletismo", atributo: "forca", proficiente: false, expertise: false },
          { nome: "Atuação", atributo: "carisma", proficiente: false, expertise: false },
          { nome: "Enganação", atributo: "carisma", proficiente: false, expertise: false },
          { nome: "Furtividade", atributo: "destreza", proficiente: false, expertise: false },
          { nome: "História", atributo: "inteligencia", proficiente: true, expertise: true },
          { nome: "Intimidação", atributo: "carisma", proficiente: false, expertise: false },
          { nome: "Intuição", atributo: "sabedoria", proficiente: true, expertise: false },
          { nome: "Investigação", atributo: "inteligencia", proficiente: true, expertise: false },
          { nome: "Lidar com Animais", atributo: "sabedoria", proficiente: false, expertise: false },
          { nome: "Medicina", atributo: "sabedoria", proficiente: false, expertise: false },
          { nome: "Natureza", atributo: "inteligencia", proficiente: false, expertise: false },
          { nome: "Percepção", atributo: "sabedoria", proficiente: true, expertise: false },
          { nome: "Persuasão", atributo: "carisma", proficiente: true, expertise: false },
          { nome: "Prestidigitação", atributo: "destreza", proficiente: false, expertise: false },
          { nome: "Religião", atributo: "inteligencia", proficiente: true, expertise: false },
          { nome: "Sobrevivência", atributo: "sabedoria", proficiente: false, expertise: false },
        ],
      },
      inventario: [
        { id: "i1", nome: "Glamdring (espada élfica)", quantidade: 1, peso: 1.5, descricao: "Lâmina de ouro branco, encontrada em Goblin-town", equipado: true },
        { id: "i2", nome: "Narya — O Anel do Fogo", quantidade: 1, peso: 0, descricao: "Um dos Três Anéis Élficos, portador de chamas", equipado: true },
        { id: "i3", nome: "Cajado de Mago", quantidade: 1, peso: 2, descricao: "Foco arcano de madeira de carvalho", equipado: true },
        { id: "i4", nome: "Fumo de Pipe", quantidade: 3, peso: 0.1, descricao: "Para uso contemplativo", equipado: false },
        { id: "i5", nome: "Chapéu cinzento pontiagudo", quantidade: 1, peso: 0.2, descricao: "Marca registrada do Cinzento", equipado: true },
      ],
      magias: {
        classe: "Mago",
        atributo: "Inteligência",
        cd: 20,
        bonus: 12,
        slots: {
          nivel1: { total: 4, usados: 0 },
          nivel2: { total: 3, usados: 0 },
          nivel3: { total: 3, usados: 0 },
          nivel4: { total: 3, usados: 0 },
          nivel5: { total: 3, usados: 0 },
          nivel6: { total: 2, usados: 0 },
          nivel7: { total: 2, usados: 0 },
          nivel8: { total: 1, usados: 0 },
          nivel9: { total: 1, usados: 0 },
        },
        lista: [
          { id: "m1", nome: "Bola de Fogo", nivel: 3, escola: "Evocação", tempo: "1 ação", alcance: "45m", duracao: "Instantânea", concentracao: false, ritual: false, preparada: true, descricao: "Cria uma explosão de fogo de 6m de raio" },
          { id: "m2", nome: "Relâmpago", nivel: 3, escola: "Evocação", tempo: "1 ação", alcance: "27m", duracao: "Instantânea", concentracao: false, ritual: false, preparada: true },
          { id: "m3", nome: "Missil Mágico", nivel: 1, escola: "Evocação", concentracao: false, ritual: false, preparada: true },
          { id: "m4", nome: "Luz", nivel: 0, escola: "Evocação", concentracao: false, ritual: false, preparada: true },
          { id: "m5", nome: "Detectar Magia", nivel: 1, escola: "Adivinhação", concentracao: true, ritual: true, preparada: true },
          { id: "m6", nome: "Teia", nivel: 2, escola: "Conjuração", concentracao: true, ritual: false, preparada: true },
          { id: "m7", nome: "Parar o Tempo", nivel: 9, escola: "Transmutação", concentracao: false, ritual: false, preparada: true },
          { id: "m8", nome: "Desejo", nivel: 9, escola: "Conjuração", concentracao: false, ritual: false, preparada: true },
        ],
      },
      notas: "Narya concede: +4 CA, resistência a fogo, inspiração de coragem a aliados.\nGlamdring brilha azul quando orcs se aproximam.",
      isPublic: true,
      publicToken: "gandalf-token-01",
    },
  });

  console.log("✅ Ficha D&D:", gandalf.nomePersonagem);

  // Generic RPG — Vampire: The Masquerade
  const lestat = await db.ficha.upsert({
    where: { slug: "lestat-de-lioncourt-vtm" },
    update: {},
    create: {
      slug: "lestat-de-lioncourt-vtm",
      userId: user.id,
      nomePersonagem: "Lestat de Lioncourt",
      sistema: "generico",
      classe: "Vampiro",
      raca: "Ventrue",
      subclasse: "Príncipe",
      nivel: 5,
      historia: "Nascido na França do século XVIII, Lestat foi transformado em vampiro por Magnus. Ambicioso, carismático e eternamente sedento por poder, ele se tornou um dos vampiros mais poderosos da América. Sua natureza Ventrue lhe confere controle sobre mortais e uma sede de poder sem igual.",
      isPublic: true,
      publicToken: "lestat-token-01",
      camposPersonalizados: [
        { id: "c1", chave: "Geração", valor: "7ª" },
        { id: "c2", chave: "Humanidade", valor: "6" },
        { id: "c3", chave: "Força de Vontade", valor: "8" },
        { id: "c4", chave: "Sangue por Turno", valor: "3" },
        { id: "c5", chave: "Disciplinas", valor: "Dominação 4, Presença 5, Robustez 3, Fortaleza 2" },
        { id: "c6", chave: "Status Social", valor: "Príncipe de New Orleans" },
        { id: "c7", chave: "Aliados", valor: "Louis de Pointe du Lac, Claudia" },
        { id: "c8", chave: "Fraqueza Clânica", valor: "Apenas pode alimentar-se de indivíduos de classe alta" },
        { id: "c9", chave: "Habilidade Especial", valor: "Canto sobrenatural — apresentações hipnóticas" },
      ],
      tracos: {
        tracoPersonalidade: "Eternamente irônico, ávido por vida e sempre em busca de atenção.",
        ideal: "Os vampiros são a evolução suprema. Por que se esconder quando se pode reinar?",
        vinculo: "Apesar de tudo, ainda ama Louis — e talvez seja sua maior fraqueza.",
        fraqueza: "Arrogância sem limites. Subestima mortais com frequência fatal.",
      },
      notas: "Pontos de sangue: 20/20\nFrenesi: Fogo, Sunlight, Cruz de Ouro",
    },
  });

  console.log("✅ Ficha genérica:", lestat.nomePersonagem);
  console.log("\n🎲 Seed concluído! Acesse:");
  console.log("   http://localhost:3000/p/gandalf-o-cinzento-demo");
  console.log("   http://localhost:3000/p/lestat-de-lioncourt-vtm");
  console.log("   Login: demo@playerforallrpg.com / demo1234");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
