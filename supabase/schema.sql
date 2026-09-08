-- =========================================================
-- KAMEL FAOUR PORTFOLIO - SUPABASE DATABASE SCHEMA & SEED
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. Profile Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT 'Kamel Faour',
  title TEXT NOT NULL DEFAULT 'Software Developer',
  short_bio TEXT NOT NULL,
  long_bio TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  cv_url TEXT,
  profile_image_url TEXT,
  location TEXT DEFAULT 'Lebanon',
  availability_status TEXT DEFAULT 'Open to opportunities',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 2. Projects Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  category TEXT NOT NULL DEFAULT 'Web Application',
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 3. Technologies Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- ---------------------------------------------------------
-- 4. Project Technologies (Pivot)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_technologies (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  technology_id UUID REFERENCES public.technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

-- ---------------------------------------------------------
-- 5. Experiences Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- 6. Skills Table
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access on profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Allow public read access on projects" ON public.projects FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Allow public read access on technologies" ON public.technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on project_technologies" ON public.project_technologies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read access on skills" ON public.skills FOR SELECT USING (true);

-- Authenticated admin full access policies
CREATE POLICY "Allow admin all on profile" ON public.profile FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all on technologies" ON public.technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all on project_technologies" ON public.project_technologies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all on experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin all on skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------------------------------------------------------
-- Storage Bucket for Images
-- ---------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read on portfolio-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow authenticated uploads to portfolio-images"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'portfolio-images')
WITH CHECK (bucket_id = 'portfolio-images');

-- ---------------------------------------------------------
-- SEED DATA
-- ---------------------------------------------------------

-- Profile
INSERT INTO public.profile (
  name,
  title,
  short_bio,
  long_bio,
  email,
  phone,
  linkedin_url,
  github_url,
  cv_url,
  profile_image_url,
  location,
  availability_status
) VALUES (
  'Kamel Faour',
  'Software Developer',
  'I build reliable web and mobile applications with a focus on clean architecture, practical solutions, and user experience.',
  'Software developer with practical experience across frontend, backend, database design, and cloud deployment. Focused on building robust full-stack systems and intuitive user interfaces using modern stacks like Next.js, React, Laravel, Flutter, and PostgreSQL.',
  'faour5kamel@gmail.com',
  '+961 71 605 349',
  'https://linkedin.com/in/kamel-faour',
  'https://github.com/kamel404',
  '',
  '/images/kamel-faour.jpg',
  'Lebanon',
  'Available for full-time & freelance roles'
) ON CONFLICT DO NOTHING;

-- Technologies
INSERT INTO public.technologies (name, category) VALUES
  ('Next.js', 'Frontend'),
  ('React', 'Frontend'),
  ('TypeScript', 'Frontend'),
  ('Tailwind CSS', 'Frontend'),
  ('Laravel', 'Backend'),
  ('PHP', 'Backend'),
  ('Node.js', 'Backend'),
  ('Spring Boot', 'Backend'),
  ('Flutter', 'Mobile'),
  ('Dart', 'Mobile'),
  ('PostgreSQL', 'Databases'),
  ('MySQL', 'Databases'),
  ('Supabase', 'Cloud & Tools'),
  ('Docker', 'Cloud & Tools'),
  ('Git', 'Cloud & Tools')
ON CONFLICT (name) DO NOTHING;

-- Sample Projects
INSERT INTO public.projects (
  title,
  slug,
  short_description,
  description,
  category,
  featured,
  published,
  sort_order,
  github_url,
  live_url
) VALUES
  (
    'MU Connect',
    'mu-connect',
    'A comprehensive university community platform designed to help students share academic resources, organize study groups, and connect.',
    'Developed a full-featured university platform facilitating seamless communication between students and faculty. Features include event announcements, study groups, real-time messaging, and shared document repositories.',
    'University Platform',
    true,
    true,
    1,
    'https://github.com/kamel404/mu-connect',
    ''
  ),
  (
    'Cloud Commerce Suite',
    'cloud-commerce-suite',
    'Modern e-commerce platform with automated inventory tracking, secure payments, and an administrative dashboard.',
    'End-to-end commerce solution featuring dynamic catalog management, cart persistence, stripe payments integration, and automated order fulfillment workflows.',
    'E-commerce',
    true,
    true,
    2,
    'https://github.com/kamel404/cloud-commerce',
    ''
  ),
  (
    'TaskFlow Mobile',
    'taskflow-mobile',
    'Cross-platform productivity app built with Flutter featuring offline caching, team sync, and intuitive task boards.',
    'Clean mobile task management application designed for agile teams. Implemented offline-first persistence with local SQLite and remote synchronization.',
    'Mobile Application',
    false,
    true,
    3,
    'https://github.com/kamel404/taskflow-mobile',
    ''
  )
ON CONFLICT (slug) DO NOTHING;

-- Sample Experiences
INSERT INTO public.experiences (company, position, description, start_date, end_date, current, sort_order)
VALUES
  (
    'Freelance / Independent',
    'Full Stack Software Developer',
    '• Designed and built responsive web and mobile applications for diverse clients.\n• Architected RESTful APIs and optimized PostgreSQL and MySQL databases.\n• Integrated third-party APIs, authentication providers, and payment gateways.\n• Deployed and maintained cloud solutions with automated CI/CD pipelines.',
    '2024',
    NULL,
    true,
    1
  ),
  (
    'Academic & Team Projects',
    'Software Developer',
    '• Collaborated on multi-disciplinary engineering projects adhering to Agile and clean code methodologies.\n• Implemented microservices architectures using Laravel, Node.js, and Spring Boot.\n• Built cross-platform mobile experiences with Flutter.',
    '2022',
    '2024',
    false,
    2
  )
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO public.skills (name, category, sort_order) VALUES
  -- Frontend
  ('Next.js', 'Frontend', 1),
  ('React', 'Frontend', 2),
  ('TypeScript', 'Frontend', 3),
  ('Tailwind CSS', 'Frontend', 4),
  ('HTML5 / CSS3', 'Frontend', 5),
  -- Backend
  ('Laravel', 'Backend', 6),
  ('PHP', 'Backend', 7),
  ('Node.js', 'Backend', 8),
  ('Spring Boot', 'Backend', 9),
  ('RESTful APIs', 'Backend', 10),
  -- Mobile
  ('Flutter', 'Mobile', 11),
  ('Dart', 'Mobile', 12),
  -- Databases
  ('PostgreSQL', 'Databases', 13),
  ('MySQL', 'Databases', 14),
  ('Supabase', 'Databases', 15),
  -- Tools & Cloud
  ('Git & GitHub', 'Tools & Cloud', 16),
  ('Docker', 'Tools & Cloud', 17),
  ('Vercel', 'Tools & Cloud', 18),
  ('Postman', 'Tools & Cloud', 19)
ON CONFLICT DO NOTHING;
