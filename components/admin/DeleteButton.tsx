"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteButtonProps {
  title?: string;
  className?: string;
}

export function DeleteButton({
  title = "Delete",
  className = "p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer",
}: DeleteButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={title}
      className={`${className} disabled:opacity-50`}
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </button>
  );
}
