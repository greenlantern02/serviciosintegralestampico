import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-brand-teal text-white hover:bg-brand-teal-dark",
        navy: "bg-brand-navy text-white hover:bg-brand-navy-dark",
        outline: "border-2 border-brand-teal bg-transparent text-brand-teal hover:bg-brand-teal hover:text-white",
        "outline-white": "border-2 border-white bg-transparent text-white hover:bg-white hover:text-brand-navy",
        ghost: "text-brand-teal hover:bg-brand-light-blue",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5d]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-6",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
