# Personal Portfolio

A professional, modern, content-focused personal portfolio built with Next.js and Supabase.

The portfolio is designed primarily for recruiters, HR professionals, hiring managers, clients, and technical reviewers. The visual direction is intentionally simple and formal rather than heavily animated or AI-styled.

## Project Goals

- Present a professional personal profile.
- Make the website easy for HR/recruiters to scan.
- Showcase selected software projects.
- Present technical skills clearly without excessive visual noise.
- Provide CV, GitHub, LinkedIn, and contact information.
- Allow portfolio content to be managed through a private admin panel.
- Avoid hardcoding projects and personal information in the frontend.
- Keep the application fast, responsive, accessible, and SEO-friendly.
- Deploy the initial version using free services.

---

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| Hosting | Vercel |
| Source Control | GitHub |

### Why Next.js?

Next.js is used as the full-stack framework so the project does not require a separate Laravel backend.

It provides:

- React-based UI
- Server Components
- Server-side functionality
- SEO support
- Static generation
- API/server functionality
- Easy Vercel deployment

### Why Supabase?

Supabase provides the required backend infrastructure without maintaining a separate server:

- PostgreSQL database
- Authentication
- Storage
- Row Level Security
- Database APIs

---

# Architecture

```text
                         ┌──────────────────────┐
                         │      Visitors        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Next.js        │
                         │   Public Portfolio   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Supabase        │
                         │      PostgreSQL      │
                         └──────────────────────┘


                         ┌──────────────────────┐
                         │       Admin          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       Next.js        │
                         │     /admin           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Supabase        │
                         │ Auth / DB / Storage  │
                         └──────────────────────┘

                         Deployment: Vercel
```

The public website and admin panel are part of the same Next.js application.

---

# Design System

## Design Direction

The website should feel:

- Professional
- Minimal
- Modern
- Mature
- Human
- Clean
- Content-focused
- Easy to scan

Avoid:

- Excessive gradients
- 3D graphics
- Particle backgrounds
- AI-generated illustrations
- Hacker aesthetics
- Excessive animations
- Huge animated typography
- Skill percentage bars
- Unnecessary technology logos
- Cursor-following effects
- Overly complex UI

The content and projects should be the primary focus.

---

## Color Palette

The visual direction uses a warm, earthy palette inspired by Claude/Anthropic's visual language.

```text
Background       #F7F6F2
Surface          #FFFFFF
Primary Text     #1F1F1C
Secondary Text   #6B6A63
Accent           #D97757
Accent Dark      #B9573D
Border           #E4E1D8
Warm Beige       #EDE8DE
Soft Cream       #F2EFE8
Muted Green      #6F8068
Muted Brown      #8A6F5A
```

### Usage

The UI should remain predominantly neutral.

Use the accent color for:

- Primary buttons
- Links
- Hover states
- Active navigation
- Small highlights
- Important UI elements

Do not use the accent color as the dominant page background.

---

# Typography

Primary font:

**Inter**

Use it for:

- Body text
- Navigation
- Buttons
- Labels
- Project information
- Technical content

A restrained serif font may be introduced for selected headings if it improves the visual identity, but typography should remain simple.

Avoid excessive font combinations.

---

# Public Website

The public application should be structured approximately as:

```text
/
├── Hero
├── About
├── Projects
├── Experience
├── Skills
├── Contact
└── Footer
```

The homepage should contain the primary portfolio content.

---

## Navigation

Desktop:

```text
Kamel [Last Name]

About
Projects
Experience
Skills
Contact

Download CV
```

Mobile navigation should use a simple responsive menu.

Navigation should remain unobtrusive.

---

# Hero Section

The hero must immediately communicate:

1. Name
2. Professional title
3. Short value proposition
4. Primary action
5. Secondary action

Example:

```text
Kamel [Last Name]

Software Developer

I build reliable web and mobile applications
with a focus on clean architecture, practical
solutions, and user experience.

[View My Work] [Download CV]
```

Avoid generic developer slogans such as:

```text
🚀 Passionate Full Stack Developer
💻 Coding the Future
🤖 AI Enthusiast
🔥 10x Developer
```

The tone must remain professional.

---

# About Section

The About section should be approximately 100–180 words.

It should communicate:

- Professional background
- Main development focus
- Types of software developed
- General engineering approach

The content must be editable through the admin panel.

---

# Projects

Projects are one of the most important parts of the portfolio.

Target:

**5–8 strong projects**

Do not display every project ever created.

Each project should support:

```text
Title
Slug
Short description
Full description
Category
Project image
Technologies
GitHub URL
Live/demo URL
Featured status
Published status
Display order
```

Example presentation:

```text
MU Connect

University Community Platform

Laravel · React · PostgreSQL

A university community platform designed to help
students share resources, discover events, organize
study groups and interact with their academic community.

[View Project] [GitHub]
```

Project descriptions should communicate:

```text
Problem
   ↓
Solution
   ↓
Technology
   ↓
Result
```

Do not make the project card only a list of technologies.

---

# Project Categories

Initial categories:

```text
Web Application
Mobile Application
SaaS
Business System
E-commerce
University Platform
API / Backend
Other
```

The category system may be extended later.

---

# Experience

Experience should be presented as a clean vertical list or timeline.

Each experience record supports:

```text
Company
Position
Description
Start date
End date
Current position
Technologies
Display order
```

Example:

```text
Software Developer
Freelance / Independent
2024 — Present

- Developed web and mobile applications for clients.
- Designed REST APIs and database architectures.
- Deployed applications to cloud infrastructure.
```

---

# Skills

Skills should be grouped rather than displayed as percentage bars.

Initial categories:

```text
Frontend
Backend
Mobile
Database
DevOps
Tools
Other
```

Example:

```text
Frontend
React
Next.js
HTML
CSS
Tailwind CSS

Backend
Laravel
PHP
Spring Boot
REST APIs

Mobile
Flutter
Dart

Databases
PostgreSQL
MySQL
SQLite

Tools & Cloud
Git
Docker
Vercel
Render
DigitalOcean
```

Do not use subjective skill percentages such as:

```text
React     95%
Laravel   90%
```

---

# Contact

The contact section should be simple.

Display:

- Email
- LinkedIn
- GitHub
- CV

Optional contact form can be added later.

Initial implementation does not require a contact form.

---

# Footer

Keep the footer minimal.

Example:

```text
© 2026 Kamel [Last Name]

Software Developer

GitHub · LinkedIn · Email
```

---

# Admin Panel

The private admin panel is a core feature of the project.

Route:

```text
/admin
```

Authentication is required.

The admin panel allows the portfolio owner to update content without changing source code.

## Admin Sections

```text
Dashboard
Projects
Experience
Skills
Profile
Settings
```

---

# Admin Dashboard

The dashboard should provide a simple overview.

Example:

```text
Projects            7
Experience          3
Skills              18
Published Projects  6
```

Do not implement complex analytics initially.

---

# Project Management

Admin functionality:

- Create project
- Edit project
- Delete project
- Publish/unpublish project
- Mark project as featured
- Change project order
- Upload project image
- Add GitHub URL
- Add live/demo URL
- Add technologies
- Add category
- Edit short description
- Edit full description

Project fields:

```text
id
title
slug
short_description
description
image_url
github_url
live_url
category
featured
published
sort_order
created_at
updated_at
```

---

# Experience Management

Admin functionality:

- Create experience
- Edit experience
- Delete experience
- Change order
- Mark current position

Fields:

```text
id
company
position
description
start_date
end_date
current
sort_order
created_at
updated_at
```

---

# Skills Management

Admin functionality:

- Add skill
- Edit skill
- Delete skill
- Assign category
- Change display order

Fields:

```text
id
name
category
sort_order
```

---

# Profile Management

The admin panel must allow editing:

```text
Name
Professional title
Short bio
Long bio
Email
Phone
LinkedIn URL
GitHub URL
CV URL
Profile image
Location
Availability status
```

Personal information should not be hardcoded throughout the frontend.

---

# Database Schema

Initial database structure:

```text
users
├── id
├── email
└── created_at


profile
├── id
├── name
├── title
├── short_bio
├── long_bio
├── email
├── phone
├── linkedin_url
├── github_url
├── cv_url
├── profile_image_url
├── location
├── availability_status
└── updated_at


projects
├── id
├── title
├── slug
├── short_description
├── description
├── image_url
├── github_url
├── live_url
├── category
├── featured
├── published
├── sort_order
├── created_at
└── updated_at


technologies
├── id
├── name
└── category


project_technologies
├── project_id
└── technology_id


experiences
├── id
├── company
├── position
├── description
├── start_date
├── end_date
├── current
├── sort_order
├── created_at
└── updated_at


skills
├── id
├── name
├── category
└── sort_order
```

---

# Database Relationships

```text
projects
   │
   │ many-to-many
   ▼
technologies

projects
   │
   └── project_technologies

profile
   │
   └── single profile record

experiences
   │
   └── multiple records

skills
   │
   └── multiple records
```

A project can have multiple technologies.

A technology can belong to multiple projects.

---

# Security

The admin panel must be protected.

Requirements:

- Supabase Authentication
- Protected `/admin` routes
- Authenticated admin user only
- Row Level Security enabled
- Public users can only read public portfolio content
- Public users cannot modify data
- Admin users can create/update/delete portfolio content
- Service-role keys must never be exposed to the client

Never commit:

```text
.env.local
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

in client-side code.

---

# Supabase Storage

Use Supabase Storage for portfolio images.

Recommended bucket:

```text
portfolio-images
```

Suggested structure:

```text
portfolio-images/
├── profile/
├── projects/
└── cv/
```

Images should be optimized and appropriately sized before being displayed.

Use Next.js Image where applicable.

---

# Environment Variables

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

If server-side secrets are later required, they must use non-`NEXT_PUBLIC_` environment variables.

Example:

```env
SUPABASE_SERVICE_ROLE_KEY=
```

The service-role key must only be used on trusted server-side code.

---

# Recommended Folder Structure

```text
portfolio/
│
├── app/
│   ├── page.tsx
│   ├── about/
│   ├── projects/
│   ├── experience/
│   ├── contact/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── projects/
│   │   ├── experience/
│   │   ├── skills/
│   │   ├── profile/
│   │   └── settings/
│   │
│   ├── api/
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── about/
│   ├── projects/
│   ├── experience/
│   ├── skills/
│   ├── contact/
│   └── ui/
│
├── lib/
│   ├── supabase/
│   ├── utils/
│   └── validations/
│
├── types/
│
├── public/
│   ├── favicon/
│   └── static/
│
├── middleware.ts
│
├── .env.local
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

The structure can be adjusted as the implementation evolves.

---

# Responsive Design

The portfolio must work correctly on:

- Mobile
- Tablet
- Laptop
- Desktop

Recommended test widths:

```text
320px
375px
425px
768px
1024px
1280px
1440px+
```

Mobile experience is especially important because portfolio links may be opened directly from LinkedIn, email, or messaging applications.

---

# Animation Guidelines

Animations must be minimal.

Allowed:

- Button hover transitions
- Link transitions
- Small opacity transitions
- Subtle section entrance
- Image hover effects
- Smooth scrolling

Avoid:

- 3D animations
- Particle backgrounds
- Cursor-following effects
- Excessive parallax
- Animated gradients
- Large page transitions
- Heavy animation libraries
- Animations that delay content

The site should remain visually strong with animations disabled.

---

# Accessibility

Requirements:

- Semantic HTML
- Correct heading hierarchy
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- Meaningful image alt text
- Accessible buttons
- Accessible navigation
- No critical information communicated only through color
- Respect reduced-motion preferences

---

# SEO

Implement:

- Page title
- Meta description
- Open Graph metadata
- Twitter/X metadata
- Favicon
- Sitemap
- Robots.txt
- Semantic HTML
- Correct heading hierarchy
- Descriptive image alt text

Example title:

```text
Kamel [Last Name] — Software Developer
```

Example description:

```text
Software developer building web and mobile applications
with experience across frontend, backend, databases and cloud deployment.
```

---

# Performance

Performance is a priority.

Use:

- Next.js Server Components where appropriate
- Static generation where appropriate
- Optimized images
- Next.js Image
- Minimal client-side JavaScript
- Minimal dependencies
- Proper font loading
- Lazy loading where appropriate

Avoid unnecessary client components.

The goal is to achieve strong Lighthouse scores, particularly for:

- Performance
- Accessibility
- Best Practices
- SEO

---

# Development Phases

## Phase 1 — Project Setup

- [ ] Create Next.js project
- [ ] Configure TypeScript
- [ ] Configure Tailwind CSS
- [ ] Configure ESLint
- [ ] Initialize Git
- [ ] Create GitHub repository
- [ ] Create Supabase project
- [ ] Configure environment variables

## Phase 2 — Design System

- [ ] Define colors
- [ ] Define typography
- [ ] Define spacing
- [ ] Create buttons
- [ ] Create cards
- [ ] Create container
- [ ] Create section component
- [ ] Create navigation
- [ ] Create footer
- [ ] Establish responsive rules

## Phase 3 — Public Portfolio

- [ ] Hero
- [ ] About
- [ ] Projects
- [ ] Experience
- [ ] Skills
- [ ] Contact
- [ ] Footer
- [ ] CV download
- [ ] GitHub
- [ ] LinkedIn

## Phase 4 — Database

- [ ] Create profile table
- [ ] Create projects table
- [ ] Create technologies table
- [ ] Create project-technologies relation
- [ ] Create experiences table
- [ ] Create skills table
- [ ] Add constraints
- [ ] Configure relationships
- [ ] Configure Row Level Security

## Phase 5 — Authentication

- [ ] Configure Supabase Auth
- [ ] Create admin login
- [ ] Protect `/admin`
- [ ] Implement session handling
- [ ] Implement logout
- [ ] Implement unauthorized handling

## Phase 6 — Admin Panel

- [ ] Dashboard
- [ ] Project CRUD
- [ ] Experience CRUD
- [ ] Skills CRUD
- [ ] Profile management
- [ ] Project ordering
- [ ] Publish/unpublish
- [ ] Featured projects

## Phase 7 — Storage

- [ ] Create Supabase Storage bucket
- [ ] Project image upload
- [ ] Profile image upload
- [ ] Image replacement
- [ ] Image deletion
- [ ] Image previews

## Phase 8 — SEO / Performance

- [ ] Metadata
- [ ] Open Graph
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Favicon
- [ ] Image optimization
- [ ] Accessibility audit
- [ ] Lighthouse audit

## Phase 9 — Deployment

- [ ] Push project to GitHub
- [ ] Connect GitHub repository to Vercel
- [ ] Configure production environment variables
- [ ] Deploy
- [ ] Test production build
- [ ] Test admin authentication
- [ ] Test database operations
- [ ] Test image uploads
- [ ] Test mobile layout

---

# Deployment

## Initial Hosting

The application will initially use the free Vercel deployment domain:

```text
https://<project-name>.vercel.app
```

A custom domain will be added later.

## Production Environment

Vercel should contain the required environment variables.

Development:

```text
.env.local
```

Production:

```text
Vercel Environment Variables
```

Do not commit environment secrets to GitHub.

---

# Git Workflow

Recommended branches:

```text
main
develop
feature/*
```

Examples:

```text
feature/public-home
feature/projects
feature/admin-auth
feature/admin-projects
feature/admin-profile
```

Recommended commit style:

```text
feat: add projects section
feat: implement admin authentication
feat: add project management
fix: improve mobile navigation
style: refine portfolio typography
perf: optimize project images
refactor: simplify project data layer
```

---

# Admin UX Principles

The admin panel is a productivity interface, not the main design showcase.

Prioritize:

- Clear forms
- Good validation
- Easy editing
- Image previews
- Publish/unpublish controls
- Clear success/error messages
- Confirmation before destructive actions
- Simple navigation

Do not over-engineer the admin dashboard.

---

# Validation

Validate all forms.

Examples:

```text
Project title
→ required

Short description
→ required

Slug
→ required
→ unique

GitHub URL
→ valid URL if provided

Live URL
→ valid URL if provided

Image
→ valid image type
→ reasonable file size

Dates
→ valid date values
```

Client-side validation improves UX, but server-side validation must still be enforced.

---

# Future Features

These should not be implemented in the initial MVP unless required:

- Blog
- Case studies
- Testimonials
- Analytics dashboard
- Contact form
- Newsletter
- Multiple CV versions
- Project analytics
- Multiple themes
- Dark mode
- Custom admin roles
- Custom domain

The first version should remain focused.

---

# MVP Definition

The first production version is complete when the following are working.

## Public Website

- [ ] Responsive navigation
- [ ] Hero
- [ ] About
- [ ] Projects
- [ ] Experience
- [ ] Skills
- [ ] Contact
- [ ] Footer
- [ ] CV download
- [ ] GitHub link
- [ ] LinkedIn link

## Admin

- [ ] Login
- [ ] Dashboard
- [ ] Project CRUD
- [ ] Experience CRUD
- [ ] Skills CRUD
- [ ] Profile editing
- [ ] Image upload
- [ ] Publish/unpublish
- [ ] Featured projects
- [ ] Project ordering

## Infrastructure

- [ ] Supabase configured
- [ ] PostgreSQL schema created
- [ ] Authentication configured
- [ ] RLS configured
- [ ] Storage configured
- [ ] Vercel deployment
- [ ] Environment variables configured
- [ ] SEO metadata
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Favicon
- [ ] Responsive testing
- [ ] Accessibility testing

---

# Definition of Done

A recruiter should be able to open the website and understand within approximately 30 seconds:

1. Who Kamel is.
2. What he does.
3. What technologies he works with.
4. What kind of applications he builds.
5. Which projects demonstrate his abilities.
6. How to contact him.
7. Where to download his CV.

The portfolio owner should also be able to log into:

```text
/admin
```

and update portfolio content without modifying source code.

---

# Core Engineering Principle

The portfolio itself should demonstrate the qualities expected from a professional software developer:

> **Simple architecture. Clear UX. Good engineering. No unnecessary complexity.**

The visual design should support the content, not compete with it.

The projects and engineering work should be the impressive part.
