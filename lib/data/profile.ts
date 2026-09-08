import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export const defaultProfile: Profile = {
  id: "default-profile",
  name: "Kamel Faour",
  title: "Software Developer",
  short_bio:
    "I build reliable web and mobile applications with a focus on clean architecture, practical solutions, and user experience.",
  long_bio:
    "Software developer with practical experience across frontend, backend, database design, and cloud deployment. Passionate about engineering clean, maintainable systems and delivering intuitive digital products that solve real-world problems. Experienced with modern full-stack technologies including Next.js, Laravel, Flutter, and PostgreSQL.",
  email: "faour5kamel@gmail.com",
  phone: "+961 71 605 349",
  linkedin_url: "https://linkedin.com/in/kamel-faour",
  github_url: "https://github.com/kamel404",
  cv_url: "",
  profile_image_url: "/images/kamel-faour.jpg",
  location: "Lebanon",
  availability_status: "Available for full-time & freelance roles",
};

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return defaultProfile;
    }

    return {
      ...defaultProfile,
      ...data,
    };
  } catch {
    return defaultProfile;
  }
}
