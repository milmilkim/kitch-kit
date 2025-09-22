import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base", 
      lg: "px-8 py-4 text-lg",
    };
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white hover:shadow-lg hover:-translate-y-1 focus:ring-blue-500",
      secondary: "bg-white text-[#667eea] border-2 border-[#667eea] hover:bg-[#667eea] hover:text-white focus:ring-blue-500",
    };
    
    return (
      <button
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className ?? ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button; 