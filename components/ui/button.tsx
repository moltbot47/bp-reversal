import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", asChild, className = "", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#EB9D2A] text-white shadow-[0_2px_0_0_#C4800F] hover:bg-[#D4891F] active:translate-y-[1px] active:shadow-[0_1px_0_0_#C4800F]",
      secondary:
        "bg-white border border-gray-200 text-[#1D2939] hover:bg-gray-50",
      ghost: "text-[#667085] hover:text-[#1D2939] hover:bg-gray-100",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3 gap-2",
    };

    return (
      <Comp
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
