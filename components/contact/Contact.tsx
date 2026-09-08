import React from "react";
import { Section } from "@/components/ui/Section";
import { Profile } from "@/types";
import { Mail, FileText, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

interface ContactProps {
  profile: Profile;
}

export function Contact({ profile }: ContactProps) {
  const contactLinks = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <Mail className="w-5 h-5 text-[#D97757]" />,
      actionText: "Send Email",
    },
    {
      label: "GitHub",
      value: profile.github_url ? "github.com/kamel404" : "Available on request",
      href: profile.github_url || "https://github.com/kamel404",
      icon: <GithubIcon className="w-5 h-5 text-[#D97757]" />,
      actionText: "View Profile",
      external: true,
    },
    {
      label: "LinkedIn",
      value: profile.linkedin_url ? "linkedin.com/in/kamel-faour" : "Available on request",
      href: profile.linkedin_url || "https://linkedin.com",
      icon: <LinkedinIcon className="w-5 h-5 text-[#D97757]" />,
      actionText: "Connect",
      external: true,
    },
  ];

  return (
    <Section
      id="contact"
      title="Get In Touch"
      subtitle="Interested in working together or discussing potential opportunities? Feel free to reach out directly."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className="group bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-xs hover:border-[#D97757] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-[#EDE8DE]/50 rounded-lg w-fit mb-4 group-hover:bg-[#D97757]/10 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xs uppercase font-semibold tracking-wider text-[#6B6A63]">
                {item.label}
              </h3>
              <p className="mt-1 font-medium text-base text-[#1F1F1C] truncate">
                {item.value}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E1D8]/60 flex items-center justify-between text-xs font-semibold text-[#D97757] group-hover:text-[#B9573D]">
              <span>{item.actionText}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>

      {/* CV Download Banner */}
      {profile.cv_url && (
        <div className="mt-8 bg-[#EDE8DE]/60 border border-[#E4E1D8] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#D97757]" />
            <div>
              <h4 className="font-semibold text-sm text-[#1F1F1C]">
                Curriculum Vitae (CV)
              </h4>
              <p className="text-xs text-[#6B6A63]">
                Download a PDF copy of my full résumé.
              </p>
            </div>
          </div>
          <Button
            href={profile.cv_url}
            variant="primary"
            size="sm"
            external
            download
          >
            Download CV
          </Button>
        </div>
      )}
    </Section>
  );
}
