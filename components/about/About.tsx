import React from "react";
import { Section } from "@/components/ui/Section";
import { Profile } from "@/types";
import { MapPin, Briefcase, Code, CheckCircle2 } from "lucide-react";

interface AboutProps {
  profile: Profile;
}

export function About({ profile }: AboutProps) {
  return (
    <Section
      id="about"
      title="About Me"
      subtitle="Background, engineering mindset, and areas of expertise."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Main Bio */}
        <div className="md:col-span-2 space-y-4 text-[#1F1F1C]/90 text-base sm:text-lg leading-relaxed">
          <p>{profile.long_bio}</p>
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#1F1F1C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6F8068]" />
              <span>Clean, maintainable code architecture</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6F8068]" />
              <span>Responsive, accessible user interfaces</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6F8068]" />
              <span>Robust database design & REST APIs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#6F8068]" />
              <span>Cross-platform mobile applications</span>
            </div>
          </div>
        </div>

        {/* Quick Facts Sidebar */}
        <div className="bg-[#FFFFFF] border border-[#E4E1D8] rounded-lg p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-[#1F1F1C]/80">
            Quick Facts
          </h3>

          <div className="space-y-3 text-sm">
            {profile.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-[#6B6A63]">Location</div>
                  <div className="font-medium text-[#1F1F1C]">{profile.location}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Briefcase className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-[#6B6A63]">Role</div>
                <div className="font-medium text-[#1F1F1C]">{profile.title}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Code className="w-4 h-4 text-[#D97757] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs text-[#6B6A63]">Core Stack</div>
                <div className="font-medium text-[#1F1F1C]">Next.js, Laravel, Flutter, PostgreSQL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
