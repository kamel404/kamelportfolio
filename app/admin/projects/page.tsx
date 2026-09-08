import React from "react";
import Link from "next/link";
import { getProjects } from "@/lib/data/projects";
import { deleteProject } from "../actions";
import { Plus, ExternalLink, Star } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminProjectsPage() {
  const projects = await getProjects(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
            Project Management
          </h1>
          <p className="text-sm text-[#6B6A63] mt-1">
            Create, edit, and organize portfolio projects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      <div className="bg-white border border-[#E4E1D8] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F6F2] border-b border-[#E4E1D8] text-[#6B6A63] text-xs uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E1D8]">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#F7F6F2]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#1F1F1C]">
                    <div>{project.title}</div>
                    <div className="text-xs text-[#6B6A63] font-mono">{project.slug}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Tag variant="default">{project.category}</Tag>
                  </td>
                  <td className="py-3.5 px-4">
                    {project.published ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {project.featured && (
                      <Star className="w-4 h-4 text-[#D97757] fill-[#D97757]" />
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-[#6B6A63] hover:text-[#1F1F1C] inline-block"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        await deleteProject(project.id);
                      }}
                      className="inline-block"
                    >
                      <DeleteButton title="Delete Project" />
                    </form>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B6A63]">
                    No projects found. Click "Add Project" to create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
