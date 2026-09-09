"use client";

import React, { useState } from "react";
import { saveExperience } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { CvImportModal } from "./CvImportModal";
import { ParsedExperience } from "@/lib/cv-parser";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExperienceFormProps {
  currentCvUrl?: string | null;
}

export function ExperienceForm({ currentCvUrl }: ExperienceFormProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form field states for potential autofill
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [sortOrder, setSortOrder] = useState("1");
  const [description, setDescription] = useState("");

  const handleFillForm = (exp: ParsedExperience) => {
    setCompany(exp.company || "");
    setPosition(exp.position || "");
    setStartDate(exp.start_date || "");
    setEndDate(exp.end_date || "");
    setIsCurrent(Boolean(exp.current));
    setDescription(exp.description || "");
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1F1F1C]">
              Add New Experience
            </h2>
            <p className="text-xs text-[#6B6A63] mt-0.5">
              Fill manually or import from your CV to populate fields instantly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-[#E4E1D8] hover:border-[#D97757]/60 bg-[#F7F6F2] hover:bg-[#EDE8DE] text-xs sm:text-sm font-semibold text-[#1F1F1C] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
            <span>Import from CV</span>
          </button>
        </div>

        <form action={saveExperience} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Company / Organization *
              </label>
              <input
                type="text"
                name="company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Freelance / Independent"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Position / Role *
              </label>
              <input
                type="text"
                name="position"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Start Date / Year *
              </label>
              <input
                type="text"
                name="start_date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="e.g. 2024"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                End Date (leave blank if current)
              </label>
              <input
                type="text"
                name="end_date"
                disabled={isCurrent}
                value={isCurrent ? "" : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder={isCurrent ? "Present" : "e.g. 2025"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 disabled:bg-[#F7F6F2] disabled:text-[#6B6A63]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                name="current"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
              />
              <span>Currently working here (Present)</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Description / Responsibilities * (Bullet points, one per line)
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="• Engineered full-stack web applications...&#10;• Designed PostgreSQL database architectures...&#10;• Deployed cloud services..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <SubmitButton loadingText="Adding Experience...">
              Add Experience
            </SubmitButton>
          </div>
        </form>
      </div>

      <CvImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        target="experience"
        currentCvUrl={currentCvUrl}
        onFillExperienceForm={handleFillForm}
        onSuccess={handleSuccess}
      />
    </>
  );
}
