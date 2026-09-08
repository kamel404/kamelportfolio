import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types";

export const defaultProjects: Project[] = [
  {
    id: "proj-1",
    title: "MU Connect",
    slug: "mu-connect",
    short_description:
      "A comprehensive university community platform designed to help students share resources, organize study groups, and interact.",
    description:
      "Engineered an all-in-one community portal for university students and faculty. Features role-based access, course resource hubs, event scheduling, and real-time interaction channels.",
    category: "University Platform",
    featured: true,
    published: true,
    sort_order: 1,
    github_url: "https://github.com/kamel404/mu-connect",
    live_url: "",
    technologies: ["Laravel", "React", "PostgreSQL", "Tailwind CSS"],
  },
  {
    id: "proj-2",
    title: "Cloud Commerce Suite",
    slug: "cloud-commerce-suite",
    short_description:
      "Modern e-commerce platform with automated inventory tracking, secure checkout, and intuitive admin analytics.",
    description:
      "Robust full-stack commerce application with real-time stock alerts, dynamic shopping carts, stripe payment integration, and a comprehensive sales reporting dashboard.",
    category: "E-commerce",
    featured: true,
    published: true,
    sort_order: 2,
    github_url: "https://github.com/kamel404/cloud-commerce",
    live_url: "",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
  },
  {
    id: "proj-3",
    title: "TaskFlow Mobile",
    slug: "taskflow-mobile",
    short_description:
      "Cross-platform task and team management mobile app featuring offline-first storage and instant synchronization.",
    description:
      "Designed and developed a sleek productivity app with board views, priority tags, offline sync using SQLite, and push notification reminders.",
    category: "Mobile Application",
    featured: false,
    published: true,
    sort_order: 3,
    github_url: "https://github.com/kamel404/taskflow-mobile",
    live_url: "",
    technologies: ["Flutter", "Dart", "Firebase", "REST APIs"],
  },
];

export async function getProjects(onlyPublished: boolean = true): Promise<Project[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("projects")
      .select(`
        *,
        project_technologies (
          technologies ( name )
        )
      `)
      .order("sort_order", { ascending: true });

    if (onlyPublished) {
      query = query.eq("published", true);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return onlyPublished ? defaultProjects.filter((p) => p.published) : defaultProjects;
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      short_description: item.short_description,
      description: item.description,
      image_url: item.image_url,
      github_url: item.github_url,
      live_url: item.live_url,
      category: item.category,
      featured: item.featured,
      published: item.published,
      sort_order: item.sort_order,
      technologies: item.project_technologies
        ? item.project_technologies
            .map((pt: any) => pt.technologies?.name)
            .filter(Boolean)
        : [],
    }));
  } catch {
    return onlyPublished ? defaultProjects.filter((p) => p.published) : defaultProjects;
  }
}
