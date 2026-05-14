import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { generateFichaPDF } from "@/lib/pdf-generator";
import type { FichaCompleta } from "@/types/ficha";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ficha = await db.ficha.findUnique({ where: { id: params.id } });
  if (!ficha) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (ficha.userId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pdfBytes = await generateFichaPDF(ficha as unknown as FichaCompleta);

  const filename = `${ficha.nomePersonagem.replace(/[^a-z0-9]/gi, "_")}.pdf`;
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
