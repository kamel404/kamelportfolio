"use client";

import React, { useState } from "react";
import { Experience } from "@/types";
import { deleteExperience, seedDefaultExperiences } from "@/app/admin/actions";
import { EditExperienceModal } from "./EditExperienceModal";
import { Edit2, Trash2, Loader2, Sparkles, AlertCircle, Building2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExperienceListProps {
  experiences: Experience[];
  onEditInForm?: (exp: Experience) => void;
}

export function ExperienceList({ experiences, onEditInForm }: ExperienceListProps) {
  const router = useRouter();

  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (exp: Experience) => {
    if (!confirm(`Are you sure you want to delete "${exp.position}" at ${exp.company}?`)) {
      return;
    }

    setActionError(null);
    setDeletingId(exp.id);

    try {
      const res = await deleteExperience(exp.id);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to delete experience.");
      }
      router.refresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete experience.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedSamples = async () => {
    setIsSeeding(true);
    setActionError(null);

    try {
      const res = await seedDefaultExperiences();
      if (!res.success) {
        throw new Error(res.error || "Failed to load sample experiences.");
      }
      router.refresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to seed sample experiences.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1F1F1C]">
          Existing Experience ({experiences.length})
        </h2>

        {experiences.length === 0 && (
          <button
            type="button"
            disabled={isSeeding}
            onClick={handleSeedSamples}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE8DE] hover:bg-[#E4E1D8] text-[#1F1F1C] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97757]" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
            )}
            Load Sample Template
          </button>
        )}
      </div>

      {actionError && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{actionError}</span>
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-[#E4E1D8] rounded-xl bg-[#F7F6F2]/50">
          <Building2 className="w-8 h-8 mx-auto text-[#6B6A63] opacity-60 mb-2" />
          <h3 className="text-sm font-semibold text-[#1F1F1C]">No experiences in database</h3>
          <p className="text-xs text-[#6B6A63] mt-1 max-w-sm mx-auto">
            You currently have no experience records. Use the form above to add one, click "Import from CV", or load the sample template.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E1D8]">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="py-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-base text-[#1F1F1C]">
                    {exp.position}
                  </h3>
                  <span className="text-xs text-[#6B6A63]">•</span>
                  <span className="text-sm font-medium text-[#D97757]">
                    {exp.company}
                  </span>
                  {exp.current && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Present
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6B6A63]">
                  <Calendar className="w-3.5 h-3.5 text-[#6B6A63]" />
                  <span>
                    {exp.start_date} — {exp.current ? "Present" : exp.end_date || "N/A"}
                  </span>
                  {exp.sort_order !== undefined && (
                    <>
                      <span>•</span>
                      <span>Order: {exp.sort_order}</span>
                    </>
                  )}
                </div>

                {exp.description && (
                  <div className="pt-1">
                    <p className="text-xs text-[#6B6A63] line-clamp-2 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                <button
                  type="button"
                  onClick={() => setEditingExperience(exp)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F1F1C] hover:text-[#D97757] bg-[#F7F6F2] hover:bg-[#EDE8DE] border border-[#E4E1D8] rounded-lg transition-colors cursor-pointer"
                  title="Edit Experience"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  disabled={deletingId === exp.id}
                  onClick={() => handleDelete(exp)}
                  className="p-1.5 text-[#6B6A63] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Experience"
                >
                  {deletingId === exp.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingExperience && (
        <EditExperienceModal
          isOpen={true}
          onClose={() => setEditingExperience(null)}
          experience={editingExperience}
        />
      )}
    </div>
  );
}
