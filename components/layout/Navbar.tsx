import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { FileText } from "lucide-react";

interface NavbarProps {
  name: string;
  cvUrl?: string;
}

export function Navbar({ name, cvUrl }: NavbarProps) {
  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F6F2]/90 backdrop-blur-md border-b border-[#E4E1D8]">
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-semibold tracking-tight text-[#1F1F1C] hover:text-[#D97757] transition-colors"
          >
            {name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-[#6B6A63] hover:text-[#1F1F1C] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              href={cvUrl || "#contact"}
              variant="secondary"
              size="sm"
              external={Boolean(cvUrl)}
              download={Boolean(cvUrl)}
            >
              <FileText className="w-3.5 h-3.5 text-[#D97757]" />
              Download CV
            </Button>
            <Link
              href="/admin"
              className="text-xs text-[#6B6A63] hover:text-[#1F1F1C] px-2 py-1 rounded transition-colors"
              title="Admin Portal"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu */}
          <MobileMenu cvUrl={cvUrl} />
        </div>
      </Container>
    </header>
  );
}
