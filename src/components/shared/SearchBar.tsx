import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ className, containerClassName, placeholder, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <span className="pointer-events-none absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
        <Search size={17} />
      </span>
      <input
        type="text"
        placeholder={placeholder ?? "Where are you headed?"}
        className={cn(
          "h-14 w-full rounded-2xl border border-[var(--color-border-subtle)]",
          "bg-[var(--color-neutral-950)] pl-14 pr-4 text-base text-neutral-50 shadow-[var(--shadow-soft)]",
          "placeholder:text-neutral-400 outline-none transition-all duration-200",
          "focus:border-primary-500 focus:shadow-[var(--shadow-elevated)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
