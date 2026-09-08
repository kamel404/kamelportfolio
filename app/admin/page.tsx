import React from "react";
import Link from "next/link";
import { getProjects } from "@/lib/data/projects";
import { getExperiences } from "@/lib/data/experience";
import { getSkills } from "@/lib/data/skills";
import {
  FolderGit2,
  Briefcase,
  Wrench,
  CheckCircle2,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [projects, experiences, skills] = await Promise.all([
    getProjects(false), // Fetch all projects including unpublished
    getExperiences(),
    getSkills(),
  ]);

  const publishedProjects = projects.filter((p) => p.published).length;

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: <FolderGit2 className="w-5 h-5 text-[#D97757]" />,
      href: "/admin/projects",
    },
    {
      label: "Published Projects",
      value: publishedProjects,
      icon: <CheckCircle2 className="w-5 h-5 text-[#6F8068]" />,
      href: "/admin/projects",
    },
    {
      label: "Work Experience",
      value: experiences.length,
      icon: <Briefcase className="w-5 h-5 text-[#D97757]" />,
      href: "/admin/experience",
    },
    {
      label: "Skills Listed",
      value: skills.length,
      icon: <Wrench className="w-5 h-5 text-[#D97757]" />,
      href: "/admin/skills",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
          Dashboard Overview
        </h1>
        <p className="text-sm text-[#6B6A63] mt-1">
          Manage your portfolio content without touching source code.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-[#E4E1D8] rounded-xl p-5 shadow-xs hover:border-[#D97757]/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B6A63] uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 bg-[#EDE8DE]/40 rounded-lg group-hover:bg-[#D97757]/10 transition-colors">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1F1F1C] mt-3">
              {stat.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#1F1F1C]">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/projects/new"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E1D8] hover:border-[#D97757] hover:bg-[#F7F6F2] transition-colors group"
          >
            <span className="text-sm font-medium text-[#1F1F1C] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D97757]" />
              Add New Project
            </span>
            <ArrowRight className="w-4 h-4 text-[#6B6A63] group-hover:text-[#D97757] transition-colors" />
          </Link>

          <Link
            href="/admin/experience"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E1D8] hover:border-[#D97757] hover:bg-[#F7F6F2] transition-colors group"
          >
            <span className="text-sm font-medium text-[#1F1F1C] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D97757]" />
              Manage Experience
            </span>
            <ArrowRight className="w-4 h-4 text-[#6B6A63] group-hover:text-[#D97757] transition-colors" />
          </Link>

          <Link
            href="/admin/profile"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#E4E1D8] hover:border-[#D97757] hover:bg-[#F7F6F2] transition-colors group"
          >
            <span className="text-sm font-medium text-[#1F1F1C] flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#D97757]" />
              Edit Profile & CV
            </span>
            <ArrowRight className="w-4 h-4 text-[#6B6A63] group-hover:text-[#D97757] transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
