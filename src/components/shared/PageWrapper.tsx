import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function PageWrapper({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-full py-8 sm:py-10 lg:py-12", className)} {...props}>
      {children}
    </div>
  );
}
