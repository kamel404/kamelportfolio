import React from "react";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  className = "",
}: TagProps) {
  const variantStyles = {
    default: "bg-[#EDE8DE] text-[#1F1F1C] border border-[#E4E1D8]",
    accent: "bg-[#D97757]/10 text-[#B9573D] border border-[#D97757]/20 font-medium",
    muted: "bg-[#F2EFE8] text-[#6B6A63] border border-transparent",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs tracking-tight ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
