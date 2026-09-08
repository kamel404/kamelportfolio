"use client";

import React, { useState, useMemo } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { Section } from "@/components/ui/Section";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A curated selection of software applications, demonstrating full-stack engineering, API design, and practical solutions."
    >
      {/* Category Filters */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#D97757] text-white shadow-xs"
                  : "bg-white text-[#6B6A63] border border-[#E4E1D8] hover:text-[#1F1F1C] hover:bg-[#EDE8DE]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-[#6B6A63] text-sm">
          No projects found in this category.
        </div>
      )}
    </Section>
  );
}
