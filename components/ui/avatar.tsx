"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({ src, name, size = "md", className }: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const initials = name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() ?? "?";
  const sizeClass = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-lg", xl: "h-24 w-24 text-2xl" }[size];

  return (
    <AvatarPrimitive.Root className={cn("relative flex shrink-0 overflow-hidden rounded-full", sizeClass, className)}>
      {src && <AvatarPrimitive.Image src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />}
      <AvatarPrimitive.Fallback className="flex h-full w-full items-center justify-center bg-arcane/20 text-arcane font-cinzel font-semibold">
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
