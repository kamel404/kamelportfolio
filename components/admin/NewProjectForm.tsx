"use client";

import React, { useState } from "react";
import Link from "next/link";
import { saveProject } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { CvImportModal } from "./CvImportModal";
import { ParsedProject } from "@/lib/cv-parser";
import { Sparkles, ArrowLeft, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

interface NewProjectFormProps {
  currentCvUrl?: string | null;
}

export function NewProjectForm({ currentCvUrl }: NewProjectFormProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form field states for potential autofill
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Application");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [technologies, setTechnologies] = useState("");

  const handleFillForm = (proj: ParsedProject) => {
    setTitle(proj.title || "");
    setCategory(proj.category || "Web Application");
    setSlug(proj.slug || (proj.title ? proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""));
    setShortDescription(proj.short_description || "");
    setDescription(proj.description || "");
    setGithubUrl(proj.github_url || "");
    setLiveUrl(proj.live_url || "");
    setImageUrl(proj.image_url || "");
    setFeatured(Boolean(proj.featured));
    setPublished(proj.published !== false);
    if (proj.technologies && proj.technologies.length > 0) {
      setTechnologies(proj.technologies.join(", "));
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects"
              className="p-2 rounded-lg border border-[#E4E1D8] bg-white text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#1F1F1C]">Add New Project</h1>
              <p className="text-xs sm:text-sm text-[#6B6A63]">
                Enter project details or import them instantly from your CV.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#E4E1D8] hover:border-[#D97757]/60 bg-white hover:bg-[#F7F6F2] text-xs sm:text-sm font-semibold text-[#1F1F1C] shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#D97757]" />
            <span>Import from CV</span>
          </button>
        </div>

        <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs">
          <form action={saveProject} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                    }
                  }}
                  placeholder="e.g. MU Connect"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                URL Slug (Optional - auto-generated if empty)
              </label>
              <input
                type="text"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. mu-connect"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Technologies (comma-separated)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="technologies"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g. Flutter, Laravel, PostgreSQL, Stripe"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
                <Tag className="w-4 h-4 text-[#6B6A63] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Short Description * (Problem & Solution summary)
              </label>
              <textarea
                name="short_description"
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary shown on the project card..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Full Description / Architectural Highlights (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed explanation of system design, database choices, or engineering challenges..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  Live / Demo URL
                </label>
                <input
                  type="url"
                  name="live_url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  Project Image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or Supabase storage link"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                  Display Order
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

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
                />
                <span>Feature on homepage</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
                />
                <span>Publish (visible to public)</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#E4E1D8] flex items-center justify-end gap-3">
              <Link
                href="/admin/projects"
                className="px-4 py-2.5 rounded-lg border border-[#E4E1D8] text-sm font-medium text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] transition-colors"
              >
                Cancel
              </Link>
              <SubmitButton loadingText="Saving Project...">
                Save Project
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>

      <CvImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        target="projects"
        currentCvUrl={currentCvUrl}
        onFillProjectForm={handleFillForm}
        onSuccess={handleSuccess}
      />
    </>
  );
}
