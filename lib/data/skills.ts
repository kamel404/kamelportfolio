import { createClient } from "@/lib/supabase/server";
import { Skill } from "@/types";

export const defaultSkills: Skill[] = [
  // Frontend
  { id: "sk-1", name: "Next.js", category: "Frontend", sort_order: 1 },
  { id: "sk-2", name: "React", category: "Frontend", sort_order: 2 },
  { id: "sk-3", name: "TypeScript", category: "Frontend", sort_order: 3 },
  { id: "sk-4", name: "Tailwind CSS", category: "Frontend", sort_order: 4 },
  { id: "sk-5", name: "HTML5 / CSS3", category: "Frontend", sort_order: 5 },
  // Backend
  { id: "sk-6", name: "Laravel", category: "Backend", sort_order: 6 },
  { id: "sk-7", name: "PHP", category: "Backend", sort_order: 7 },
  { id: "sk-8", name: "Node.js", category: "Backend", sort_order: 8 },
  { id: "sk-9", name: "Spring Boot", category: "Backend", sort_order: 9 },
  { id: "sk-10", name: "RESTful APIs", category: "Backend", sort_order: 10 },
  // Mobile
  { id: "sk-11", name: "Flutter", category: "Mobile", sort_order: 11 },
  { id: "sk-12", name: "Dart", category: "Mobile", sort_order: 12 },
  // Databases
  { id: "sk-13", name: "PostgreSQL", category: "Databases", sort_order: 13 },
  { id: "sk-14", name: "MySQL", category: "Databases", sort_order: 14 },
  { id: "sk-15", name: "Supabase", category: "Databases", sort_order: 15 },
  // Tools & Cloud
  { id: "sk-16", name: "Git & GitHub", category: "Tools & Cloud", sort_order: 16 },
  { id: "sk-17", name: "Docker", category: "Tools & Cloud", sort_order: 17 },
  { id: "sk-18", name: "Vercel", category: "Tools & Cloud", sort_order: 18 },
  { id: "sk-19", name: "Postman", category: "Tools & Cloud", sort_order: 19 },
];

export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultSkills;
    }

    return data;
  } catch {
    return defaultSkills;
  }
}
