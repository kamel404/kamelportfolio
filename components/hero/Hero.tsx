import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Profile } from "@/types";
import { ArrowDown, FileText, Mail, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section className="py-16 sm:py-24 md:py-28 border-b border-[#E4E1D8]/60 overflow-hidden">
      <Container>
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-14 lg:gap-16">
          {/* Left Column - Content */}
          <div className="flex-1 max-w-2xl animate-fade-in">
            {/* Availability pill */}
            {profile.availability_status && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#6F8068]/10 text-[#6F8068] border border-[#6F8068]/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#6F8068] animate-pulse" />
                {profile.availability_status}
              </div>
            )}

            {/* Name & Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1F1F1C] leading-[1.15]">
              {profile.name}
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-[#D97757] mt-3">
              {profile.title}
            </p>

            {/* Value proposition */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-[#6B6A63] leading-relaxed max-w-xl">
              {profile.short_bio}
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3">
              <Button href="#projects" variant="primary" size="lg">
                View My Work
                <ArrowDown className="w-4 h-4" />
              </Button>
              {profile.cv_url ? (
                <Button
                  href={profile.cv_url}
                  variant="secondary"
                  size="lg"
                  external
                  download
                >
                  <FileText className="w-4 h-4 text-[#D97757]" />
                  Download CV
                </Button>
              ) : (
                <Button href="#contact" variant="secondary" size="lg">
                  <Mail className="w-4 h-4 text-[#D97757]" />
                  Contact Me
                </Button>
              )}
            </div>

            {/* Quick social links */}
            <div className="mt-8 pt-6 border-t border-[#E4E1D8]/60 flex items-center gap-5 text-[#6B6A63]">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#1F1F1C]/70">
                Connect:
              </span>
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm hover:text-[#D97757] transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm hover:text-[#D97757] transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm hover:text-[#D97757] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Profile Image Card */}
          {profile.profile_image_url && (
            <div className="shrink-0 animate-fade-in-delayed">
              <div className="relative p-2.5 bg-white border border-[#E4E1D8] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[420px] rounded-xl overflow-hidden bg-[#EDE8DE]">
                  <Image
                    src={profile.profile_image_url}
                    alt={profile.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* Overlapping feature pill */}
                <div className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md border border-[#E4E1D8] shadow-sm px-3.5 py-2 rounded-xl text-xs font-medium text-[#1F1F1C] flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#D97757]/10 text-[#D97757]">
                    <Code2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Full Stack Developer</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
