"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function SubmitButton({
  children,
  loadingText = "Saving...",
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#D97757] hover:bg-[#B9573D] text-white shadow-xs",
    secondary:
      "bg-white text-[#1F1F1C] border border-[#E4E1D8] hover:bg-[#EDE8DE]",
    danger:
      "bg-red-600 hover:bg-red-700 text-white shadow-xs",
  };

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
