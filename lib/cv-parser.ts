import { extractText } from "unpdf";
import mammoth from "mammoth";

export interface ParsedExperience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  description: string;
  technologies?: string[];
  selected?: boolean;
  imported?: boolean;
}

export interface ParsedProject {
  id: string;
  title: string;
  slug?: string;
  category: string;
  short_description: string;
  description?: string;
  github_url?: string;
  live_url?: string;
  image_url?: string;
  technologies?: string[];
  featured?: boolean;
  published?: boolean;
  selected?: boolean;
  imported?: boolean;
}

export interface CvParseResult {
  rawText: string;
  experiences: ParsedExperience[];
  projects: ParsedProject[];
}

/**
 * Extract raw text from a File or Buffer based on its mime type / extension
 */
export async function extractTextFromCvFile(
  buffer: Buffer,
  fileName: string,
  mimeType?: string
): Promise<string> {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  try {
    if (ext === "pdf" || mimeType?.includes("pdf")) {
      const { text } = await extractText(new Uint8Array(buffer));
      return Array.isArray(text) ? text.join("\n\n") : text || "";
    }

    if (ext === "docx" || ext === "doc" || mimeType?.includes("word") || mimeType?.includes("officedocument")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    // Default to plain text
    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error extracting text from CV file:", error);
    // Fallback simple string conversion
    return buffer.toString("utf-8");
  }
}

/**
 * Date detection helper
 * Matches formats like:
 * 2022 - 2024
 * Jan 2023 - Present
 * 05/2021 – Current
 * Sept 2020 - Ongoing
 * 2024
 */
function extractDates(text: string): { start_date: string; end_date: string | null; current: boolean } {
  const dateRegex =
    /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?\b(19\d{2}|20\d{2})\b(?:\s*[\-–—to]+\s*(?:((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?(19\d{2}|20\d{2})|present|current|ongoing|now))?/i;

  const match = text.match(dateRegex);
  if (!match) {
    return { start_date: new Date().getFullYear().toString(), end_date: null, current: true };
  }

  const start_date = match[1];
  const isPresent = /present|current|ongoing|now/i.test(match[0]);
  const end_date = isPresent ? null : (match[3] || null);

  return {
    start_date,
    end_date,
    current: isPresent || !end_date,
  };
}

/**
 * Common tech stack keywords for tech detection
 */
const COMMON_TECHS = [
  "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "NestJS", "Python",
  "Django", "FastAPI", "Flask", "PHP", "Laravel", "Spring Boot", "Java", "C#", ".NET",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Supabase", "Firebase", "Docker",
  "Kubernetes", "AWS", "GCP", "Azure", "Vercel", "Tailwind CSS", "TypeScript", "JavaScript",
  "HTML5", "CSS3", "GraphQL", "REST API", "Flutter", "React Native", "Android", "iOS",
  "Git", "GitHub", "CI/CD", "Linux", "Prisma", "Drizzle", "Redux", "Zustand"
];

function extractTechnologies(text: string): string[] {
  const found: string[] = [];
  for (const tech of COMMON_TECHS) {
    const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(text)) {
      found.push(tech);
    }
  }
  return Array.from(new Set(found));
}

/**
 * Rule-based heuristic parser for Work Experience
 */
export function parseExperiencesFromText(cvText: string): ParsedExperience[] {
  const lines = cvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const experiences: ParsedExperience[] = [];

  // 1. Locate Experience Section Header
  const expHeaderRegex = /^(?:work\s+|professional\s+|career\s+)?experience|employment\s+history|work\s+history/i;
  const nextSectionHeaderRegex = /^(?:education|projects|skills|technical\s+skills|certifications|awards|languages|interests|volunteer|publications)/i;

  let inExperienceSection = false;
  const experienceLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeader = expHeaderRegex.test(line) && line.length < 50;

    if (isHeader) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection) {
      if (nextSectionHeaderRegex.test(line) && line.length < 40) {
        break;
      }
      experienceLines.push(line);
    }
  }

  // If no clear section header was found, scan the whole text for experience blocks
  const targetLines = experienceLines.length > 0 ? experienceLines : lines;

  // 2. Identify entries: lines with date ranges often mark a job entry
  const dateRangePattern = /(?:19\d{2}|20\d{2})\s*[\-–—to]+\s*(?:19\d{2}|20\d{2}|present|current|ongoing)/i;

  interface RawEntry {
    headerLines: string[];
    bodyLines: string[];
  }

  const rawEntries: RawEntry[] = [];
  let currentEntry: RawEntry | null = null;

  for (let i = 0; i < targetLines.length; i++) {
    const line = targetLines[i];
    const hasDate = dateRangePattern.test(line);

    if (hasDate) {
      if (currentEntry) {
        rawEntries.push(currentEntry);
      }
      // If previous line looked like a company or job title, bundle it
      const prevLine = targetLines[i - 1];
      const headerLines = [line];
      if (prevLine && !prevLine.startsWith("•") && !prevLine.startsWith("-") && prevLine.length < 80) {
        headerLines.unshift(prevLine);
      }
      currentEntry = { headerLines, bodyLines: [] };
    } else if (currentEntry) {
      currentEntry.bodyLines.push(line);
    }
  }

  if (currentEntry) {
    rawEntries.push(currentEntry);
  }

  // Process raw entries
  rawEntries.forEach((entry, idx) => {
    const combinedHeader = entry.headerLines.join(" | ");
    const dates = extractDates(combinedHeader);

    let company = "";
    let position = "";

    const textWithoutDates = combinedHeader.replace(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19\d{2}|20\d{2})\s*[\-–—to]+\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+)?(?:19\d{2}|20\d{2})|present|current|ongoing)/gi, "").trim();
    
    const parts = textWithoutDates.split(/[\–\—\|\•\:\,]\s*/).map((p) => p.trim()).filter((p) => p.length > 1);

    if (parts.length >= 2) {
      const looksLikeRole = /developer|engineer|lead|manager|intern|architect|consultant|specialist|designer|freelance/i;
      if (looksLikeRole.test(parts[0])) {
        position = parts[0];
        company = parts[1];
      } else {
        company = parts[0];
        position = parts[1];
      }
    } else if (parts.length === 1) {
      position = parts[0];
      company = "Independent / Organization";
    } else {
      company = `Experience Entry #${idx + 1}`;
      position = "Software Engineer";
    }

    // Process bullet points in body lines
    const bulletLines = entry.bodyLines.map((l) => {
      let cleaned = l.replace(/^[\s•\-\*\>]+/, "").trim();
      return cleaned ? `• ${cleaned}` : "";
    }).filter(Boolean);

    const description = bulletLines.length > 0
      ? bulletLines.join("\n")
      : entry.bodyLines.join("\n") || "• Contributed to software development and engineering deliverables.";

    const techs = extractTechnologies(entry.headerLines.join(" ") + " " + entry.bodyLines.join(" "));

    experiences.push({
      id: `exp-parsed-${idx + 1}-${Date.now()}`,
      company: company.slice(0, 80),
      position: position.slice(0, 80),
      start_date: dates.start_date,
      end_date: dates.end_date,
      current: dates.current,
      description,
      technologies: techs,
      selected: true,
      imported: false,
    });
  });

  return experiences;
}

/**
 * Rule-based heuristic parser for Projects
 */
export function parseProjectsFromText(cvText: string): ParsedProject[] {
  const lines = cvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const projects: ParsedProject[] = [];

  // 1. Locate Projects Section Header
  const projHeaderRegex = /^(?:selected\s+|key\s+|recent\s+|personal\s+|academic\s+)?projects|portfolio/i;
  const nextSectionHeaderRegex = /^(?:experience|work\s+experience|education|skills|certifications|awards|languages|interests)/i;

  let inProjectsSection = false;
  const projectLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeader = projHeaderRegex.test(line) && line.length < 40;

    if (isHeader) {
      inProjectsSection = true;
      continue;
    }

    if (inProjectsSection) {
      if (nextSectionHeaderRegex.test(line) && line.length < 40) {
        break;
      }
      projectLines.push(line);
    }
  }

  const targetLines = projectLines.length > 0 ? projectLines : [];
  if (targetLines.length === 0) {
    return [];
  }

  // 2. Identify project titles
  interface RawProject {
    title: string;
    bodyLines: string[];
  }

  const rawProjects: RawProject[] = [];
  let currentProject: RawProject | null = null;

  for (let i = 0; i < targetLines.length; i++) {
    const line = targetLines[i];
    const isBullet = /^[•\-\*\>]/.test(line);
    const couldBeTitle = !isBullet && line.length < 75 && !/^(technologies|tech stack|tools):/i.test(line);

    if (couldBeTitle) {
      if (currentProject) {
        rawProjects.push(currentProject);
      }
      currentProject = { title: line, bodyLines: [] };
    } else if (currentProject) {
      currentProject.bodyLines.push(line);
    }
  }

  if (currentProject) {
    rawProjects.push(currentProject);
  }

  rawProjects.forEach((raw, idx) => {
    const fullText = `${raw.title} ${raw.bodyLines.join(" ")}`;
    let category = "Web Application";
    if (/mobile|flutter|react native|android|ios|swift|kotlin/i.test(fullText)) {
      category = "Mobile Application";
    } else if (/saas|subscription|cloud suite|b2b/i.test(fullText)) {
      category = "SaaS";
    } else if (/e-commerce|store|shop|cart|stripe/i.test(fullText)) {
      category = "E-commerce";
    } else if (/university|school|student|academic/i.test(fullText)) {
      category = "University Platform";
    } else if (/api|backend|microservice|rest/i.test(fullText)) {
      category = "API / Backend";
    }

    let title = raw.title;
    const separatorSplit = title.split(/[\–\—\|\:]\s*/);
    if (separatorSplit.length > 1 && separatorSplit[0].length > 2) {
      title = separatorSplit[0].trim();
    }

    const githubMatch = fullText.match(/https?:\/\/github\.com\/[^\s\)\>]+/i);
    const liveMatch = fullText.match(/https?:\/\/(?!github\.com)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}[^\s\)\>]*/i);

    const bulletLines = raw.bodyLines.map((l) => {
      let cleaned = l.replace(/^[\s•\-\*\>]+/, "").trim();
      return cleaned ? `• ${cleaned}` : "";
    }).filter(Boolean);

    let short_description = "";
    if (raw.bodyLines.length > 0) {
      short_description = raw.bodyLines[0].replace(/^[\s•\-\*\>]+/, "").trim();
    }
    if (!short_description) {
      short_description = `Engineered ${title}, a high-performance ${category.toLowerCase()} built with modern architectures.`;
    }

    const description = bulletLines.length > 0 ? bulletLines.join("\n") : raw.bodyLines.join("\n");
    const technologies = extractTechnologies(fullText);

    projects.push({
      id: `proj-parsed-${idx + 1}-${Date.now()}`,
      title: title.slice(0, 80),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      category,
      short_description: short_description.slice(0, 200),
      description,
      github_url: githubMatch ? githubMatch[0] : "",
      live_url: liveMatch ? liveMatch[0] : "",
      technologies,
      featured: idx === 0,
      published: true,
      selected: true,
      imported: false,
    });
  });

  return projects;
}

/**
 * Optional Gemini AI-powered extraction for higher accuracy when an API key is available
 */
export async function parseCvWithGemini(
  cvText: string,
  apiKey: string,
  target: "experience" | "projects" | "all" = "all"
): Promise<{ experiences: ParsedExperience[]; projects: ParsedProject[] }> {
  try {
    const prompt = `You are an expert ATS and CV parser. Analyze the following CV/Resume text and return structured JSON matching this exact format:
{
  "experiences": [
    {
      "company": "Company Name",
      "position": "Job Title / Role",
      "start_date": "Year or Mon Year (e.g. 2023)",
      "end_date": "Year or Mon Year or null",
      "current": true,
      "description": "• Bullet point 1\\n• Bullet point 2",
      "technologies": ["React", "PostgreSQL"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "category": "Web Application | Mobile Application | SaaS | E-commerce | University Platform | API / Backend | Other",
      "short_description": "1-2 sentence overview of the project and problem solved",
      "description": "• Detailed bullet points or architectural highlights",
      "github_url": "https://github.com/...",
      "live_url": "https://...",
      "technologies": ["Next.js", "Tailwind CSS"]
    }
  ]
}

CV Text:
"""
${cvText.slice(0, 15000)}
"""

Target to extract: ${target}. Return ONLY valid JSON, without markdown formatting or code blocks.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error("No response from Gemini API");
    }

    const parsed = JSON.parse(rawContent);

    const experiences: ParsedExperience[] = (parsed.experiences || []).map((exp: any, idx: number) => ({
      id: `gemini-exp-${idx + 1}-${Date.now()}`,
      company: exp.company || "Company",
      position: exp.position || "Developer",
      start_date: exp.start_date || "2023",
      end_date: exp.end_date || null,
      current: Boolean(exp.current),
      description: exp.description || "",
      technologies: exp.technologies || [],
      selected: true,
      imported: false,
    }));

    const projects: ParsedProject[] = (parsed.projects || []).map((p: any, idx: number) => ({
      id: `gemini-proj-${idx + 1}-${Date.now()}`,
      title: p.title || "Project",
      slug: (p.title || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: p.category || "Web Application",
      short_description: p.short_description || "",
      description: p.description || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      technologies: p.technologies || [],
      featured: idx === 0,
      published: true,
      selected: true,
      imported: false,
    }));

    return { experiences, projects };
  } catch (err) {
    console.warn("Gemini CV parsing failed, falling back to rule-based parser:", err);
    return {
      experiences: parseExperiencesFromText(cvText),
      projects: parseProjectsFromText(cvText),
    };
  }
}

/**
 * Main CV Parser entry point
 */
export async function parseCvContent(
  text: string,
  target: "experience" | "projects" | "all" = "all",
  geminiApiKey?: string
): Promise<CvParseResult> {
  let experiences: ParsedExperience[] = [];
  let projects: ParsedProject[] = [];

  const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    const aiResult = await parseCvWithGemini(text, apiKey, target);
    experiences = aiResult.experiences;
    projects = aiResult.projects;
  } else {
    if (target === "experience" || target === "all") {
      experiences = parseExperiencesFromText(text);
    }
    if (target === "projects" || target === "all") {
      projects = parseProjectsFromText(text);
    }
  }

  return {
    rawText: text,
    experiences,
    projects,
  };
}
