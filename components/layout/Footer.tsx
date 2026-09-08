import React from "react";
import { Container } from "@/components/ui/Container";

interface FooterProps {
  name: string;
  title: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export function Footer({
  name,
  title,
  githubUrl,
  linkedinUrl,
  email,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-[#F7F6F2] border-t border-[#E4E1D8] mt-auto">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#6B6A63]">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
            <span className="font-medium text-[#1F1F1C]">
              © {currentYear} {name}
            </span>
            <span className="hidden sm:inline text-[#E4E1D8]">|</span>
            <span>{title}</span>
          </div>

          <div className="flex items-center gap-5">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D97757] transition-colors"
              >
                GitHub
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D97757] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="hover:text-[#D97757] transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
