import React from "react";
import { getProfile } from "@/lib/data/profile";
import { updateProfile } from "../actions";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
          Profile & Social Links
        </h1>
        <p className="text-sm text-[#6B6A63] mt-1">
          Update personal details, social links, and CV download URL.
        </p>
      </div>

      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs">
        <form action={updateProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={profile.name}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                defaultValue={profile.title}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                defaultValue={profile.email}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={profile.phone || ""}
                placeholder="+961 ..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                defaultValue={profile.location || "Lebanon"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                name="availability_status"
                defaultValue={profile.availability_status || "Available for full-time & freelance roles"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                defaultValue={profile.github_url || ""}
                placeholder="https://github.com/kamel404"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                defaultValue={profile.linkedin_url || ""}
                placeholder="https://linkedin.com/in/kamel-faour"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="text"
                name="profile_image_url"
                defaultValue={profile.profile_image_url || "/images/kamel-faour.jpg"}
                placeholder="/images/kamel-faour.jpg or Supabase Storage URL"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
              <p className="text-xs text-[#6B6A63] mt-1">
                Local path (e.g. /images/kamel-faour.jpg) or full image URL.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                CV / Resume Link
              </label>
              <input
                type="url"
                name="cv_url"
                defaultValue={profile.cv_url || ""}
                placeholder="https://.../kamel-faour-cv.pdf"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
              <p className="text-xs text-[#6B6A63] mt-1">
                Direct PDF link or Supabase Storage link.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Short Hero Bio * (1-2 sentences)
            </label>
            <textarea
              name="short_bio"
              defaultValue={profile.short_bio}
              required
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
              Detailed About Bio *
            </label>
            <textarea
              name="long_bio"
              defaultValue={profile.long_bio}
              required
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
            />
          </div>

          <div className="pt-4 border-t border-[#E4E1D8] flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
