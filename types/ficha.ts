export type RPGSystem = "dnd5e" | "generico" | string;

export interface InventarioItem {
  id: string;
  nome: string;
  quantidade: number;
  peso?: number;
  descricao?: string;
  equipado: boolean;
}

export interface Magia {
  id: string;
  nome: string;
  nivel: number;
  escola?: string;
  tempo?: string;
  alcance?: string;
  duracao?: string;
  descricao?: string;
  concentracao: boolean;
  ritual: boolean;
  preparada: boolean;
}

export interface SlotsMagia {
  nivel1: { total: number; usados: number };
  nivel2: { total: number; usados: number };
  nivel3: { total: number; usados: number };
  nivel4: { total: number; usados: number };
  nivel5: { total: number; usados: number };
  nivel6: { total: number; usados: number };
  nivel7: { total: number; usados: number };
  nivel8: { total: number; usados: number };
  nivel9: { total: number; usados: number };
}

export interface MagiasData {
  classe?: string;
  atributo?: string;
  cd?: number;
  bonus?: number;
  slots: SlotsMagia;
  lista: Magia[];
}

export interface Habilidade {
  nome: string;
  atributo: "forca" | "destreza" | "constituicao" | "inteligencia" | "sabedoria" | "carisma";
  proficiente: boolean;
  expertise: boolean;
}

export interface SavingThrow {
  atributo: string;
  proficiente: boolean;
}

export interface HabilidadesData {
  habilidades: Habilidade[];
  savingThrows: SavingThrow[];
  percepcaoPassiva?: number;
}

export interface Tracos {
  tracoPersonalidade?: string;
  ideal?: string;
  vinculo?: string;
  fraqueza?: string;
}

export interface CampoPersonalizado {
  id: string;
  chave: string;
  valor: string;
}

export interface FichaCompleta {
  id: string;
  slug: string;
  userId: string;
  nomePersonagem: string;
  sistema: string;
  imageUrl?: string | null;
  raca?: string | null;
  classe?: string | null;
  subclasse?: string | null;
  nivel?: number | null;
  antecedente?: string | null;
  alinhamento?: string | null;
  xp?: number | null;
  forca?: number | null;
  destreza?: number | null;
  constituicao?: number | null;
  inteligencia?: number | null;
  sabedoria?: number | null;
  carisma?: number | null;
  pontosDeVidaMax?: number | null;
  pontosDeVidaAtual?: number | null;
  classeDeArmadura?: number | null;
  iniciativa?: number | null;
  deslocamento?: number | null;
  bonusDeProficiencia?: number | null;
  dadoDeVida?: string | null;
  habilidades?: HabilidadesData | null;
  inventario?: InventarioItem[] | null;
  magias?: MagiasData | null;
  tracos?: Tracos | null;
  historia?: string | null;
  notas?: string | null;
  camposPersonalizados?: CampoPersonalizado[] | null;
  isPublic: boolean;
  publicToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
