export interface Profile {
  id: string;
  name: string;
  title: string;
  short_bio: string;
  long_bio: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  cv_url?: string;
  profile_image_url?: string;
  location?: string;
  availability_status?: string;
  updated_at?: string;
}

export interface Technology {
  id: string;
  name: string;
  category?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  category: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  technologies?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  technologies?: string[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Mobile' | 'Databases' | 'Tools & Cloud' | 'Other' | string;
  sort_order: number;
}
