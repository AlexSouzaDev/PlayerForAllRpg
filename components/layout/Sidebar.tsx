"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Plus, Settings, Sword } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/fichas", label: "Fichas", icon: BookOpen },
  { href: "/fichas/nova", label: "Nova Ficha", icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-rpg bg-surface min-h-screen">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-rpg">
        <Sword className="h-5 w-5 text-gold" />
        <span className="font-cinzel font-bold text-parchment text-base tracking-wide">
          Player<span className="text-gold">ForAll</span>
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded px-3 py-2 text-sm font-inter transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-muted-rpg hover:text-parchment hover:bg-surface"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
