"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { deleteProject, seedDefaultProjects } from "@/app/admin/actions";
import { EditProjectModal } from "./EditProjectModal";
import {
  Edit2,
  Trash2,
  Loader2,
  Sparkles,
  AlertCircle,
  FolderGit2,
  ExternalLink,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Tag } from "@/components/ui/Tag";
import { useRouter } from "next/navigation";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (proj: Project) => {
    if (!confirm(`Are you sure you want to delete "${proj.title}"? This cannot be undone.`)) {
      return;
    }

    setActionError(null);
    setDeletingId(proj.id);

    try {
      const res = await deleteProject(proj.id);
      if (res && !res.success) {
        throw new Error(res.error || "Failed to delete project.");
      }
      router.refresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSeedSamples = async () => {
    setIsSeeding(true);
    setActionError(null);

    try {
      const res = await seedDefaultProjects();
      if (!res.success) {
        throw new Error(res.error || "Failed to load sample projects.");
      }
      router.refresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to seed sample projects.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#1F1F1C]">
          Existing Projects ({projects.length})
        </h2>

        {projects.length === 0 && (
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

      {projects.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-[#E4E1D8] rounded-xl bg-[#F7F6F2]/50">
          <FolderGit2 className="w-8 h-8 mx-auto text-[#6B6A63] opacity-60 mb-2" />
          <h3 className="text-sm font-semibold text-[#1F1F1C]">No projects in database</h3>
          <p className="text-xs text-[#6B6A63] mt-1 max-w-sm mx-auto">
            You currently have no project records. Click "Add Project" above, use "Import from CV" to parse them automatically, or load sample templates.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E4E1D8]">
          {projects.map((project) => (
            <div
              key={project.id}
              className="py-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-base text-[#1F1F1C]">
                    {project.title}
                  </h3>
                  <Tag variant="default">{project.category}</Tag>

                  {project.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20">
                      <Star className="w-3 h-3 fill-[#D97757]" />
                      Featured
                    </span>
                  )}

                  {project.published ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6B6A63] font-mono">
                  <span>/{project.slug}</span>
                  {project.sort_order !== undefined && (
                    <>
                      <span>•</span>
                      <span>Order: {project.sort_order}</span>
                    </>
                  )}
                </div>

                {project.short_description && (
                  <p className="text-xs text-[#6B6A63] line-clamp-2 leading-relaxed">
                    {project.short_description}
                  </p>
                )}

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center text-[10px] bg-[#EDE8DE] text-[#1F1F1C] px-2 py-0.5 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions & Links */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#F7F6F2] rounded-lg transition-colors"
                    title="View GitHub Repository"
                  >
                    <GithubIcon className="w-4 h-4 fill-current" />
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#F7F6F2] rounded-lg transition-colors"
                    title="View Live Site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setEditingProject(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1F1F1C] hover:text-[#D97757] bg-[#F7F6F2] hover:bg-[#EDE8DE] border border-[#E4E1D8] rounded-lg transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project)}
                  className="p-1.5 text-[#6B6A63] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                  title="Delete Project"
                >
                  {deletingId === project.id ? (
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

      {editingProject && (
        <EditProjectModal
          isOpen={true}
          onClose={() => setEditingProject(null)}
          project={editingProject}
        />
      )}
    </div>
  );
}
