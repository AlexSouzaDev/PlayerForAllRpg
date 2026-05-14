"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sword, LogOut, User, BookOpen } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-rpg bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Sword className="h-5 w-5 text-gold transition-transform group-hover:rotate-12" />
          <span className="font-cinzel font-bold text-parchment text-lg tracking-wide">
            Player<span className="text-gold">For</span>AllRPG
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/fichas">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Minhas Fichas</span>
                </Button>
              </Link>
              <Avatar src={session.user.image} name={session.user.name} size="sm" />
              <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
