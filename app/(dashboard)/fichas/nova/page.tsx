"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NovaFichaPage() {
  const router = useRouter();
  useEffect(() => { router.push("/fichas"); }, [router]);
  return null;
}
