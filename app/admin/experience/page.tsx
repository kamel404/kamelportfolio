import React from "react";
import { getExperiences } from "@/lib/data/experience";
import { getProfile } from "@/lib/data/profile";
import { deleteExperience } from "../actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { CvImportButton } from "@/components/admin/CvImportButton";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();
  const profile = await getProfile();

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
            Experience Management
          </h1>
          <p className="text-sm text-[#6B6A63] mt-1">
            Manage career history and software engineering milestones.
          </p>
        </div>

        <CvImportButton
          target="experience"
          currentCvUrl={profile.cv_url}
          label="Import from CV"
          variant="primary"
        />
      </div>

      {/* Add Experience Form (with autofill and CV import) */}
      <ExperienceForm currentCvUrl={profile.cv_url} />


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
                <DeleteButton title="Delete Experience" />
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
