"use client";

import React, { useState } from "react";
import { X, Loader2, Save, AlertCircle, Calendar, Briefcase, Building2 } from "lucide-react";
import { Experience } from "@/types";
import { updateExperienceAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Experience;
}

export function EditExperienceModal({
  isOpen,
  onClose,
  experience,
}: EditExperienceModalProps) {
  const router = useRouter();

  const [company, setCompany] = useState(experience.company || "");
  const [position, setPosition] = useState(experience.position || "");
  const [startDate, setStartDate] = useState(experience.start_date || "");
  const [endDate, setEndDate] = useState(experience.end_date || "");
  const [isCurrent, setIsCurrent] = useState(Boolean(experience.current));
  const [sortOrder, setSortOrder] = useState(experience.sort_order?.toString() || "1");
  const [description, setDescription] = useState(experience.description || "");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const res = await updateExperienceAction(experience.id, {
        company,
        position,
        start_date: startDate,
        end_date: isCurrent ? null : endDate,
        current: isCurrent,
        sort_order: parseInt(sortOrder, 10) || 0,
        description,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to update experience.");
      }

      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#E4E1D8] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E1D8] bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D97757]/10 text-[#D97757] rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1F1F1C]">
                Edit Experience
              </h2>
              <p className="text-xs text-[#6B6A63]">
                Update details for {position || "this role"} at {company || "company"}.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Company / Organization *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <Building2 className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Position / Role *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <Briefcase className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Start Date / Year *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. 2024 or Jan 2024"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <Calendar className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                End Date
              </label>
              <input
                type="text"
                disabled={isCurrent}
                value={isCurrent ? "Present" : endDate}
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
                checked={isCurrent}
                onChange={(e) => {
                  setIsCurrent(e.target.checked);
                  if (e.target.checked) setEndDate("");
                }}
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
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-xs"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E4E1D8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
