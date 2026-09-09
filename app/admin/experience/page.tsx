import React from "react";
import { getExperiences } from "@/lib/data/experience";
import { getProfile } from "@/lib/data/profile";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { CvImportButton } from "@/components/admin/CvImportButton";
import { ExperienceList } from "@/components/admin/ExperienceList";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const experiences = await getExperiences(false);
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

      {/* Experience List (with Edit modal & working Delete) */}
      <ExperienceList experiences={experiences} />
    </div>
  );
}
