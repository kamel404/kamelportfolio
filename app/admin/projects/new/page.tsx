import React from "react";
import Link from "next/link";
import { saveProject } from "../../actions";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-3xl">
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
            Enter project details to display in your portfolio.
          </p>
        </div>
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
                defaultValue="Web Application"
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
              placeholder="e.g. mu-connect"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Short Description * (Problem & Solution summary)
            </label>
            <textarea
              name="short_description"
              required
              rows={2}
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
                defaultValue={1}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
              />
              <span>Feature on homepage</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-[#1F1F1C] cursor-pointer">
              <input
                type="checkbox"
                name="published"
                defaultChecked
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
  );
}
