import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ className, containerClassName, placeholder, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary-500/15 text-primary-300">
        <Search size={17} />
      </span>
      <input
        type="text"
        placeholder={placeholder ?? "Where are you headed?"}
        className={cn(
          "h-14 w-full rounded-xl border border-[var(--color-border-default)]",
          "bg-[var(--color-bg-surface-raised)] pl-14 pr-4 text-base text-neutral-50",
          "placeholder:text-neutral-500 outline-none transition-all duration-200",
          "focus:border-primary-400/60 focus:shadow-[var(--shadow-glow-primary)] focus:bg-white/[0.03]",
          className
        )}
        {...props}
      />
    </div>
  );
}
