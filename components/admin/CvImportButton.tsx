"use client";

import React, { useState } from "react";
import { Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { CvImportModal } from "./CvImportModal";
import { ParsedExperience, ParsedProject } from "@/lib/cv-parser";

interface CvImportButtonProps {
  target?: "experience" | "projects" | "all";
  currentCvUrl?: string | null;
  label?: string;
  variant?: "primary" | "secondary" | "outline";
  onFillExperienceForm?: (exp: ParsedExperience) => void;
  onFillProjectForm?: (proj: ParsedProject) => void;
}

export function CvImportButton({
  target = "experience",
  currentCvUrl,
  label = "Import from CV",
  variant = "outline",
  onFillExperienceForm,
  onFillProjectForm,
}: CvImportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    router.refresh();
  };

  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-[#D97757] hover:bg-[#B9573D] text-white shadow-xs border-transparent";
      case "secondary":
        return "bg-[#EDE8DE] hover:bg-[#E4E1D8] text-[#1F1F1C] border-transparent";
      case "outline":
      default:
        return "bg-white hover:bg-[#F7F6F2] text-[#1F1F1C] border-[#E4E1D8] hover:border-[#D97757]/60 shadow-xs";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg border text-sm font-semibold transition-all duration-150 cursor-pointer ${getButtonStyles()}`}
      >
        <Sparkles className="w-4 h-4 text-[#D97757]" />
        <span>{label}</span>
      </button>

      <CvImportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        target={target}
        currentCvUrl={currentCvUrl}
        onFillExperienceForm={onFillExperienceForm}
        onFillProjectForm={onFillProjectForm}
        onSuccess={handleSuccess}
      />
    </>
  );
}
