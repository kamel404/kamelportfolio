"use client";

import React, { useState } from "react";
import {
  X,
  Loader2,
  Save,
  AlertCircle,
  FolderGit2,
  ExternalLink,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { ImageDropzone } from "./ImageDropzone";
import { Project } from "@/types";
import { updateProjectAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState(project.title || "");
  const [slug, setSlug] = useState(project.slug || "");
  const [category, setCategory] = useState(project.category || "Web Application");
  const [shortDescription, setShortDescription] = useState(project.short_description || "");
  const [description, setDescription] = useState(project.description || "");
  const [githubUrl, setGithubUrl] = useState(project.github_url || "");
  const [liveUrl, setLiveUrl] = useState(project.live_url || "");
  const [imageUrl, setImageUrl] = useState(project.image_url || "");
  const [sortOrder, setSortOrder] = useState(project.sort_order?.toString() || "0");
  const [featured, setFeatured] = useState(Boolean(project.featured));
  const [published, setPublished] = useState(project.published !== false);
  const [technologies, setTechnologies] = useState(
    Array.isArray(project.technologies) ? project.technologies.join(", ") : ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const techArray = technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await updateProjectAction(project.id, {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category,
        short_description: shortDescription,
        description,
        github_url: githubUrl || null,
        live_url: liveUrl || null,
        image_url: imageUrl || null,
        featured,
        published,
        sort_order: parseInt(sortOrder, 10) || 0,
        technologies: techArray,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to update project.");
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
      <div className="bg-white border border-[#E4E1D8] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E1D8] bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D97757]/10 text-[#D97757] rounded-lg">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1F1F1C]">
                Edit Project
              </h2>
              <p className="text-xs text-[#6B6A63]">
                Update details, links, and technologies for {title || "this project"}.
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
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              >
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="SaaS">SaaS</option>
                <option value="E-commerce">E-commerce</option>
                <option value="University Platform">University Platform</option>
                <option value="API / Backend">API / Backend</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Display Order
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Technologies (comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="e.g. Next.js, TypeScript, PostgreSQL, Tailwind CSS"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
              <Tag className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Short Description * (Summary for cards)
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Full Description / Highlights (Bullet points or details)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="• Architectural highlight 1&#10;• Architecture highlight 2"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                GitHub Repository URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <GithubIcon className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3 fill-current" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Live / Demo URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <ExternalLink className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
              </div>
            </div>
          </div>

          <ImageDropzone
            value={imageUrl}
            onChange={setImageUrl}
            name="image_url"
            folder="projects"
            label="Project Cover Image / Screenshot (Drag & Drop)"
            helperText="Drop your project screenshot, banner, or app preview here (PNG, JPG, WEBP up to 10MB)"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
              />
              <span>Feature on homepage</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
              />
              <span>Publish (visible to public)</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#E4E1D8] flex items-center justify-end gap-3">
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
