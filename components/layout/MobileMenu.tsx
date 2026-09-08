"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  cvUrl?: string;
}

export function MobileMenu({ cvUrl }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="p-2 text-[#1F1F1C] hover:text-[#D97757] rounded-md transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#FFFFFF] border-b border-[#E4E1D8] shadow-lg p-6 flex flex-col gap-4 z-50">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-[#1F1F1C] hover:text-[#D97757] py-2 border-b border-[#E4E1D8]/40 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              href={cvUrl || "#contact"}
              variant="primary"
              size="md"
              external={Boolean(cvUrl)}
              download={Boolean(cvUrl)}
              className="w-full"
            >
              <FileText className="w-4 h-4" />
              Download CV
            </Button>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-center text-xs text-[#6B6A63] hover:text-[#1F1F1C] py-2"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
