import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  external?: boolean;
  download?: boolean | string;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  download,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#D97757] text-white hover:bg-[#B9573D] active:scale-[0.99] shadow-sm",
    secondary:
      "bg-white text-[#1F1F1C] border border-[#E4E1D8] hover:bg-[#EDE8DE] hover:border-[#D97757]/30 shadow-xs",
    outline:
      "bg-transparent text-[#1F1F1C] border border-[#E4E1D8] hover:border-[#D97757] hover:text-[#D97757]",
    ghost:
      "bg-transparent text-[#1F1F1C] hover:bg-[#EDE8DE]/60",
  };

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          download={download}
          className={combinedStyles}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} download={download} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} {...props}>
      {children}
    </button>
  );
}
