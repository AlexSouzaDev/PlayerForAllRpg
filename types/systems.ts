export interface RPGSystemDef {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
}

export const SISTEMAS: RPGSystemDef[] = [
  {
    id: "dnd5e",
    nome: "D&D 5ª Edição",
    descricao: "Dungeons & Dragons 5e com todos os atributos, magias e habilidades",
    icon: "⚔️",
  },
  {
    id: "generico",
    nome: "Sistema Genérico",
    descricao: "Campos personalizáveis para qualquer sistema de RPG",
    icon: "🎲",
  },
];

export const ALINHAMENTOS = [
  "Leal Bom",
  "Neutro Bom",
  "Caótico Bom",
  "Leal Neutro",
  "Neutro",
  "Caótico Neutro",
  "Leal Mau",
  "Neutro Mau",
  "Caótico Mau",
];

export const RACAS_DND = [
  "Humano",
  "Elfo",
  "Meio-Elfo",
  "Anão",
  "Halfling",
  "Gnomo",
  "Meio-Orc",
  "Draconato",
  "Tiefling",
  "Aasimar",
  "Genasi",
  "Firbolg",
  "Goliath",
  "Tabaxi",
  "Kenku",
  "Outro",
];

export const CLASSES_DND = [
  "Bárbaro",
  "Bardo",
  "Bruxo",
  "Clérigo",
  "Druida",
  "Feiticeiro",
  "Guerreiro",
  "Ladino",
  "Mago",
  "Monge",
  "Paladino",
  "Patrulheiro",
];

export const ANTECEDENTES_DND = [
  "Acólito",
  "Charlatão",
  "Criminoso",
  "Artista",
  "Forasteiro",
  "Herói do Povo",
  "Guilda Artesão",
  "Eremita",
  "Nobre",
  "Marinheiro",
  "Soldado",
  "Sábio",
];

export const HABILIDADES_DND = [
  { nome: "Acrobacia", atributo: "destreza" as const },
  { nome: "Arcanismo", atributo: "inteligencia" as const },
  { nome: "Atletismo", atributo: "forca" as const },
  { nome: "Atuação", atributo: "carisma" as const },
  { nome: "Enganação", atributo: "carisma" as const },
  { nome: "Furtividade", atributo: "destreza" as const },
  { nome: "História", atributo: "inteligencia" as const },
  { nome: "Intimidação", atributo: "carisma" as const },
  { nome: "Intuição", atributo: "sabedoria" as const },
  { nome: "Investigação", atributo: "inteligencia" as const },
  { nome: "Lidar com Animais", atributo: "sabedoria" as const },
  { nome: "Medicina", atributo: "sabedoria" as const },
  { nome: "Natureza", atributo: "inteligencia" as const },
  { nome: "Percepção", atributo: "sabedoria" as const },
  { nome: "Persuasão", atributo: "carisma" as const },
  { nome: "Prestidigitação", atributo: "destreza" as const },
  { nome: "Religião", atributo: "inteligencia" as const },
  { nome: "Sobrevivência", atributo: "sabedoria" as const },
];
