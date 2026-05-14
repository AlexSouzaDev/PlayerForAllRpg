import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "arcane" | "muted" | "danger";
  className?: string;
}

export function Badge({ children, variant = "muted", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-inter font-medium",
        {
          "bg-gold/15 text-gold border border-gold/30": variant === "gold",
          "bg-arcane/15 text-arcane border border-arcane/30": variant === "arcane",
          "bg-surface text-muted-rpg border border-rpg": variant === "muted",
          "bg-danger/15 text-danger border border-danger/30": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
