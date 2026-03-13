import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-brand-teal/10 text-brand-teal border border-brand-teal/20",
        navy: "bg-brand-navy text-white",
        orange: "bg-brand-orange/10 text-brand-orange border border-brand-orange/20",
        coral: "bg-brand-coral/10 text-brand-coral border border-brand-coral/20",
        outline: "border border-current bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
