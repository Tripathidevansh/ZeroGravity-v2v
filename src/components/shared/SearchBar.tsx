import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchBar({ className, containerClassName, placeholder, ...props }: SearchBarProps) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search
        size={18}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
      />
      <input
        type="text"
        placeholder={placeholder ?? "Where are you headed?"}
        className={cn(
          "h-12 w-full rounded-[--radius-lg] border border-[--color-border-default]",
          "bg-[--color-bg-surface-raised] pl-11 pr-4 text-sm text-neutral-50",
          "placeholder:text-neutral-500 outline-none transition-colors",
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30",
          className
        )}
        {...props}
      />
    </div>
  );
}
