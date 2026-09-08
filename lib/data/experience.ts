import { createClient } from "@/lib/supabase/server";
import { Experience } from "@/types";

export const defaultExperiences: Experience[] = [
  {
    id: "exp-1",
    company: "Freelance & Independent Projects",
    position: "Full Stack Software Developer",
    description:
      "• Engineered custom web applications and cross-platform mobile apps for clients using Next.js, React, and Flutter.\n• Designed scalable PostgreSQL database architectures and secure RESTful APIs with Laravel and Node.js.\n• Configured automated deployments, environment configurations, and continuous delivery via Vercel and cloud platforms.",
    start_date: "2024",
    end_date: null,
    current: true,
    sort_order: 1,
    technologies: ["Next.js", "React", "Laravel", "Flutter", "PostgreSQL", "Docker"],
  },
  {
    id: "exp-2",
    company: "Academic & Collaborative Development",
    position: "Software Developer",
    description:
      "• Built complex multi-user platforms including university community systems and e-commerce solutions.\n• Applied strict software engineering principles: modular architectures, test-driven validation, and relational database normalization.\n• Implemented responsive frontends with accessible design patterns adhering to modern web standards.",
    start_date: "2022",
    end_date: "2024",
    current: false,
    sort_order: 2,
    technologies: ["PHP", "Laravel", "Spring Boot", "MySQL", "Tailwind CSS", "Git"],
  },
];

export async function getExperiences(): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultExperiences;
    }

    return data;
  } catch {
    return defaultExperiences;
  }
}
