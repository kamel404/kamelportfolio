import React from "react";
import Link from "next/link";
import { getProjects } from "@/lib/data/projects";
import { getProfile } from "@/lib/data/profile";
import { Plus } from "lucide-react";
import { CvImportButton } from "@/components/admin/CvImportButton";
import { ProjectList } from "@/components/admin/ProjectList";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  // CRITICAL: fallbackToDefault is FALSE so admin only views and manages real DB projects
  const projects = await getProjects(false, false);
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
            Project Management
          </h1>
          <p className="text-sm text-[#6B6A63] mt-1">
            Create, edit, delete, and import portfolio projects from your CV.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <CvImportButton
            target="projects"
            currentCvUrl={profile.cv_url}
            label="Import from CV"
            variant="outline"
          />
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </div>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
