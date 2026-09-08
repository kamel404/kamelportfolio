import React from "react";
import { Section } from "@/components/ui/Section";
import { Skill } from "@/types";
import { Tag } from "@/components/ui/Tag";
import {
  Layout,
  Server,
  Smartphone,
  Database,
  Terminal,
  Cpu,
} from "lucide-react";

interface SkillsGridProps {
  skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  // Group skills by category
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "frontend":
        return <Layout className="w-4 h-4 text-[#D97757]" />;
      case "backend":
        return <Server className="w-4 h-4 text-[#D97757]" />;
      case "mobile":
        return <Smartphone className="w-4 h-4 text-[#D97757]" />;
      case "databases":
      case "database":
        return <Database className="w-4 h-4 text-[#D97757]" />;
      case "tools & cloud":
      case "tools":
      case "devops":
        return <Terminal className="w-4 h-4 text-[#D97757]" />;
      default:
        return <Cpu className="w-4 h-4 text-[#D97757]" />;
    }
  };

  return (
    <Section
      id="skills"
      title="Technical Skills"
      subtitle="Organized by domain, emphasizing battle-tested technologies and practical tooling."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSkills).map(([category, catSkills]) => (
          <div
            key={category}
            className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-xs hover:border-[#D97757]/30 transition-all flex flex-col"
          >
            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-[#E4E1D8]/60">
              {getCategoryIcon(category)}
              <h3 className="font-semibold text-base text-[#1F1F1C]">
                {category}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 flex-1 items-start">
              {catSkills.map((skill) => (
                <Tag key={skill.id} variant="default">
                  {skill.name}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
