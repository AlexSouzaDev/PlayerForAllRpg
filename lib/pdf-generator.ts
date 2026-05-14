import { renderToBuffer } from "@react-pdf/renderer";
import { FichaPDFTemplate } from "@/components/ficha/FichaPDFTemplate";
import { createElement } from "react";
import type { FichaCompleta } from "@/types/ficha";

export async function generateFichaPDF(ficha: FichaCompleta): Promise<Uint8Array> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = createElement(FichaPDFTemplate as any, { ficha });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return renderToBuffer(element as any);
}
