import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcModificador(valor: number): number {
  return Math.floor((valor - 10) / 2);
}

export function formatModificador(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function calcBonusProficiencia(nivel: number): number {
  return Math.ceil(nivel / 4) + 1;
}
