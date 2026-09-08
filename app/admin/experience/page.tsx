import React from "react";
import { getExperiences } from "@/lib/data/experience";
import { saveExperience, deleteExperience } from "../actions";
import { Trash2 } from "lucide-react";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
          Experience Management
        </h1>
        <p className="text-sm text-[#6B6A63] mt-1">
          Manage career history and software engineering milestones.
        </p>
      </div>

      {/* Add Experience Form */}
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-semibold text-[#1F1F1C] mb-4">
          Add New Experience
        </h2>
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
                placeholder="e.g. 2025"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Sort Order
              </label>
              <input
                type="number"
                name="sort_order"
                defaultValue={1}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                name="current"
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
              placeholder="• Engineered full-stack web applications...&#10;• Designed PostgreSQL database architectures...&#10;• Deployed cloud services..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Add Experience
            </button>
          </div>
        </form>
      </div>

      {/* Experience List */}
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#1F1F1C]">
          Existing Experience ({experiences.length})
        </h2>

        <div className="divide-y divide-[#E4E1D8]">
          {experiences.map((exp) => (
            <div key={exp.id} className="py-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base text-[#1F1F1C]">
                  {exp.position}
                </h3>
                <div className="text-sm text-[#D97757]">{exp.company}</div>
                <div className="text-xs text-[#6B6A63] mt-1">
                  {exp.start_date} — {exp.current ? "Present" : exp.end_date || "N/A"}
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await deleteExperience(exp.id);
                }}
              >
                <button
                  type="submit"
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
