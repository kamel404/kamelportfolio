import React from "react";
import Image from "next/image";
import { Project } from "@/types";
import { Tag } from "@/components/ui/Tag";
import { ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  return (
    <article
      className={`group/card flex flex-col bg-[#FFFFFF] border border-[#E4E1D8] rounded-2xl overflow-hidden
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        hover:shadow-[0_12px_36px_rgba(217,119,87,0.16),0_4px_16px_rgba(0,0,0,0.06)]
        hover:border-[#D97757]/50
        hover:-translate-y-1.5
        transition-all duration-300 ease-out
        ${className}`}
    >
      {/* Project Image (if available) */}
      {project.image_url ? (
        <div className="relative w-full h-44 sm:h-48 bg-[#EDE8DE] overflow-hidden flex-shrink-0">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="w-full h-44 sm:h-48 bg-gradient-to-br from-[#EDE8DE] via-[#F7F6F2] to-[#EDE8DE]/50 border-b border-[#E4E1D8] p-5 flex flex-col justify-between relative overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <Tag variant="accent">{project.category}</Tag>
            {project.featured && (
              <span className="flex items-center gap-1 text-xs font-medium text-[#D97757]">
                <Star className="w-3.5 h-3.5 fill-[#D97757]" />
                Featured
              </span>
            )}
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div className="text-xs text-[#6B6A63] font-mono tracking-wide">
              {project.slug}
            </div>
          </div>
          {/* Decorative background watermark */}
          <div className="absolute -right-4 -bottom-6 text-[#E4E1D8]/60 font-mono text-7xl font-bold select-none pointer-events-none tracking-tighter group-hover/card:text-[#D97757]/10 transition-colors duration-300">
            &lt;/&gt;
          </div>
        </div>
      )}

      {/* Card Content — flex-1 so all cards stretch to the same height */}
      <div className="p-5 flex flex-col flex-1">
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

        <h3 className="text-lg font-semibold text-[#1F1F1C] group-hover/card:text-[#D97757] transition-colors duration-200 leading-snug">
          {project.title}
        </h3>

        {/* Description clamped to 3 lines — keeps cards uniform */}
        <p
          className="mt-2 text-sm text-[#6B6A63] leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.short_description}
        </p>

        {/* Spacer pushes technologies & links to the bottom */}
        <div className="flex-1" />

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <Tag key={tech} variant="default">
                {tech}
              </Tag>
            ))}
            {project.technologies.length > 5 && (
              <span className="px-2 py-0.5 text-xs text-[#6B6A63] bg-[#F7F6F2] rounded-md border border-[#E4E1D8]">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="mt-4 pt-4 border-t border-[#E4E1D8]/70 flex items-center gap-4 text-xs sm:text-sm">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#1F1F1C] font-medium hover:text-[#D97757] transition-colors duration-150"
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
              className="inline-flex items-center gap-1.5 text-[#D97757] font-medium hover:text-[#B9573D] transition-colors duration-150"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
