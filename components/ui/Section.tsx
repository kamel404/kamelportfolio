import React from "react";
import { Container } from "./Container";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`py-14 sm:py-20 border-b border-[#E4E1D8]/60 ${className}`}>
      <Container>
        {(title || subtitle) && (
          <div className="mb-8 sm:mb-12">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1F1C]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-2 text-sm sm:text-base text-[#6B6A63] max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
