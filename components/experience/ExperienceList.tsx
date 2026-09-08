import React from "react";
import { Section } from "@/components/ui/Section";
import { Experience } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { Briefcase, Calendar } from "lucide-react";

interface ExperienceListProps {
  experiences: Experience[];
}

export function ExperienceList({ experiences }: ExperienceListProps) {
  return (
    <Section
      id="experience"
      title="Experience & Background"
      subtitle="Professional and project history focused on building scalable, reliable software."
    >
      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 sm:before:left-4 before:w-0.5 before:bg-[#E4E1D8] before:h-full">
        {experiences.map((exp) => {
          const dateRange = exp.current
            ? `${exp.start_date} — Present`
            : `${exp.start_date} — ${exp.end_date || "Completed"}`;

          // Format bullet points
          const bulletLines = exp.description
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

          return (
            <div key={exp.id} className="relative pl-9 sm:pl-11 group">
              {/* Timeline dot */}
              <div className="absolute left-1.5 sm:left-2 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-[#D97757] group-hover:scale-110 group-hover:bg-[#D97757] transition-all" />

              <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-xs hover:border-[#D97757]/30 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1F1F1C]">
                      {exp.position}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#D97757] mt-0.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6A63] bg-[#F7F6F2] px-2.5 py-1 rounded-md border border-[#E4E1D8] self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateRange}</span>
                  </div>
                </div>

                {/* Description lines */}
                <ul className="space-y-2 text-sm text-[#6B6A63] mt-4 leading-relaxed">
                  {bulletLines.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D97757] font-bold select-none">•</span>
                      <span>{line.replace(/^[•\-]\s*/, "")}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags if provided */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#E4E1D8]/60 flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <Tag key={t} variant="muted">
                        {t}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
