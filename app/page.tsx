import React from "react";
import { getProfile } from "@/lib/data/profile";
import { getProjects } from "@/lib/data/projects";
import { getExperiences } from "@/lib/data/experience";
import { getSkills } from "@/lib/data/skills";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ExperienceList } from "@/components/experience/ExperienceList";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { Contact } from "@/components/contact/Contact";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const [profile, projects, experiences, skills] = await Promise.all([
    getProfile(),
    getProjects(true),
    getExperiences(),
    getSkills(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar name={profile.name} cvUrl={profile.cv_url} />

      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <ProjectGrid projects={projects} />
        <ExperienceList experiences={experiences} />
        <SkillsGrid skills={skills} />
        <Contact profile={profile} />
      </main>

      <Footer
        name={profile.name}
        title={profile.title}
        githubUrl={profile.github_url}
        linkedinUrl={profile.linkedin_url}
        email={profile.email}
      />
    </div>
  );
}
