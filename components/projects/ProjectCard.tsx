import React from "react";
import Image from "next/image";
import { Project } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col bg-[#FFFFFF] border border-[#E4E1D8] rounded-xl overflow-hidden shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all duration-300">
      {/* Project Image (if available) */}
      {project.image_url ? (
        <div className="relative w-full h-48 sm:h-56 bg-[#EDE8DE] overflow-hidden">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-32 bg-[#EDE8DE]/40 border-b border-[#E4E1D8] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <Tag variant="accent">{project.category}</Tag>
            {project.featured && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#D97757]">
                <Star className="w-3.5 h-3.5 fill-[#D97757]" />
                Featured
              </span>
            )}
          </div>
          <div className="text-xs text-[#6B6A63] font-mono">
            {project.slug}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        {project.image_url && (
          <div className="flex items-center justify-between mb-3">
            <Tag variant="accent">{project.category}</Tag>
            {project.featured && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#D97757]">
                <Star className="w-3.5 h-3.5 fill-[#D97757]" />
                Featured
              </span>
            )}
          </div>
        )}

        <h3 className="text-xl font-semibold text-[#1F1F1C] group-hover:text-[#D97757] transition-colors">
          {project.title}
        </h3>

        <p className="mt-3 text-sm text-[#6B6A63] leading-relaxed flex-1">
          {project.short_description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <Tag key={tech} variant="default">
                {tech}
              </Tag>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="mt-6 pt-4 border-t border-[#E4E1D8]/60 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#1F1F1C] font-medium hover:text-[#D97757] transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Code</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D97757] font-medium hover:text-[#B9573D] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
