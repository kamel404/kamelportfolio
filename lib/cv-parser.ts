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

    if (
      ext === "docx" ||
      ext === "doc" ||
      mimeType?.includes("word") ||
      mimeType?.includes("officedocument")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    return buffer.toString("utf-8");
  } catch (error) {
    console.error("Error extracting text from CV file:", error);
    return buffer.toString("utf-8");
  }
}

/**
 * Regex constants for robust parsing
 */
const MONTH_NAMES =
  "Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?";

export const DATE_RANGE_REGEX = new RegExp(
  "\\b((?:(?:" +
    MONTH_NAMES +
    ")[.\\s]+)?(?:19\\d{2}|20\\d{2}))\\s*([\\-–—to/]+)\\s*((?:(?:" +
    MONTH_NAMES +
    ")[.\\s]+)?(?:19\\d{2}|20\\d{2})|present|current|ongoing|now)\\b",
  "i"
);

const BULLET_CHAR_REGEX = /^[\s•●▪▫◦\-\*\>✦❖]+/;
const IS_BULLET_REGEX = /^[\s•●▪▫◦\-\*\>✦❖]/;

const expHeaderRegex =
  /^(?:work\s+|professional\s+|career\s+)?experience|employment(?:\s+history)?|work\s+history/i;
const projHeaderRegex =
  /^(?:special\s+|featured\s+|selected\s+|key\s+|recent\s+|personal\s+|academic\s+)?projects|portfolio/i;
const otherSectionRegex =
  /^(?:technical\s+skills|skills|education|certifications|awards|languages|interests|publications|volunteer|references)/i;

/**
 * Extracts start_date, end_date, and current flag from a line containing a date range
 */
function extractDatesFromLine(line: string): {
  start_date: string;
  end_date: string | null;
  current: boolean;
  matchedText: string;
} | null {
  const m = line.match(DATE_RANGE_REGEX);
  if (!m) return null;
  const startStr = m[1].trim();
  const endStr = m[3].trim();
  const isPresent = /present|current|ongoing|now/i.test(endStr);
  return {
    start_date: startStr,
    end_date: isPresent ? null : endStr,
    current: isPresent,
    matchedText: m[0],
  };
}

/**
 * Merges wrapped bullet continuation lines cleanly within a section
 */
function mergeSectionBullets(sectionLines: string[]): string[] {
  const merged: string[] = [];
  for (let i = 0; i < sectionLines.length; i++) {
    const line = sectionLines[i].trim();
    if (!line) continue;

    const isBullet = IS_BULLET_REGEX.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line);

    if (!isBullet && !hasDate && merged.length > 0) {
      const prev = merged[merged.length - 1];
      // If previous line was a bullet item, merge continuation
      if (IS_BULLET_REGEX.test(prev)) {
        if (prev.endsWith("-")) {
          merged[merged.length - 1] = prev + line;
        } else {
          merged[merged.length - 1] = prev + " " + line;
        }
        continue;
      }
    }
    merged.push(line);
  }
  return merged;
}

/**
 * Common tech stack keywords for tech detection
 */
const COMMON_TECHS = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "Python",
  "Django",
  "FastAPI",
  "Flask",
  "PHP",
  "Laravel",
  "Spring Boot",
  "Java",
  "C#",
  ".NET",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Supabase",
  "Firebase",
  "Docker",
  "Kubernetes",
  "AWS",
  "GCP",
  "Azure",
  "Vercel",
  "Tailwind CSS",
  "Tailwind",
  "TypeScript",
  "JavaScript",
  "Dart",
  "Flutter",
  "React Native",
  "Android",
  "iOS",
  "Git",
  "GitHub",
  "CI/CD",
  "Linux",
  "Nginx",
  "REST API",
  "GraphQL",
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
 * Parse Work Experiences from CV Text
 */
export function parseExperiencesFromText(cvText: string): ParsedExperience[] {
  const rawLines = cvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const experiences: ParsedExperience[] = [];

  // 1. Isolate Experience lines
  let inExperienceSection = false;
  const expLines: string[] = [];

  for (const line of rawLines) {
    if (expHeaderRegex.test(line) && line.length < 45) {
      inExperienceSection = true;
      continue;
    }

    if (inExperienceSection) {
      if ((projHeaderRegex.test(line) || otherSectionRegex.test(line)) && line.length < 45) {
        break;
      }
      expLines.push(line);
    }
  }

  // Fallback: if no explicit section header matched, scan whole text
  const targetLines = expLines.length > 0 ? expLines : rawLines;
  const cleanedLines = mergeSectionBullets(targetLines);

  // 2. Group into experience entries by date ranges
  interface RawExpEntry {
    headerLine: string;
    dateInfo: {
      start_date: string;
      end_date: string | null;
      current: boolean;
      matchedText: string;
    };
    bodyLines: string[];
  }

  const rawEntries: RawExpEntry[] = [];
  let currentEntry: RawExpEntry | null = null;

  for (const line of cleanedLines) {
    const dateInfo = extractDatesFromLine(line);

    if (dateInfo) {
      if (currentEntry) {
        rawEntries.push(currentEntry);
      }
      currentEntry = { headerLine: line, dateInfo, bodyLines: [] };
    } else if (currentEntry) {
      currentEntry.bodyLines.push(line);
    }
  }

  if (currentEntry) {
    rawEntries.push(currentEntry);
  }

  // 3. Process entries
  rawEntries.forEach((entry, idx) => {
    // Separate role and company from header line
    const textWithoutDate = entry.headerLine.replace(entry.dateInfo.matchedText, "").trim();
    const parts = textWithoutDate
      .split(/[\–\—\|\•\:\,]\s*/)
      .map((p) => p.trim())
      .filter(Boolean);

    let position = parts[0] || "Software Engineer";
    let company = parts[1] || "Company";

    // Detect if role / company order is inverted
    const looksLikeRole =
      /developer|engineer|lead|manager|intern|architect|consultant|specialist|designer|freelance|programmer/i;
    if (!looksLikeRole.test(parts[0]) && parts[1] && looksLikeRole.test(parts[1])) {
      company = parts[0];
      position = parts[1];
    }

    // Clean bullet points
    const bulletList: string[] = [];
    entry.bodyLines.forEach((b) => {
      const cleaned = b.replace(BULLET_CHAR_REGEX, "").trim();
      if (cleaned) {
        bulletList.push(`• ${cleaned}`);
      }
    });

    const description =
      bulletList.length > 0
        ? bulletList.join("\n")
        : "• Contributed to software development and engineering deliverables.";

    const fullText = `${entry.headerLine} ${entry.bodyLines.join(" ")}`;
    const technologies = extractTechnologies(fullText);

    experiences.push({
      id: `exp-parsed-${idx + 1}-${Date.now()}`,
      company: company.slice(0, 80),
      position: position.slice(0, 80),
      start_date: entry.dateInfo.start_date,
      end_date: entry.dateInfo.end_date,
      current: entry.dateInfo.current,
      description,
      technologies,
      selected: true,
      imported: false,
    });
  });

  return experiences;
}

/**
 * Parse Projects from CV Text
 */
export function parseProjectsFromText(cvText: string): ParsedProject[] {
  const rawLines = cvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const projects: ParsedProject[] = [];

  // 1. Isolate Projects lines
  let inProjectsSection = false;
  const projLines: string[] = [];

  for (const line of rawLines) {
    if (projHeaderRegex.test(line) && line.length < 45) {
      inProjectsSection = true;
      continue;
    }

    if (inProjectsSection) {
      if ((expHeaderRegex.test(line) || otherSectionRegex.test(line)) && line.length < 45) {
        break;
      }
      projLines.push(line);
    }
  }

  if (projLines.length === 0) {
    return [];
  }

  const cleanedLines = mergeSectionBullets(projLines);

  // 2. Identify project entries
  interface RawProject {
    headerLine: string;
    bodyLines: string[];
  }

  const rawProjects: RawProject[] = [];
  let curProj: RawProject | null = null;

  for (const line of cleanedLines) {
    const isBullet = IS_BULLET_REGEX.test(line);
    const hasDate = DATE_RANGE_REGEX.test(line);
    const couldBeTitle = !isBullet && (line.includes("|") || hasDate || line.length < 50);

    if (couldBeTitle) {
      if (curProj) {
        rawProjects.push(curProj);
      }
      curProj = { headerLine: line, bodyLines: [] };
    } else if (curProj) {
      curProj.bodyLines.push(line);
    }
  }

  if (curProj) {
    rawProjects.push(curProj);
  }

  // 3. Process each project
  rawProjects.forEach((raw, idx) => {
    const fullText = `${raw.headerLine} ${raw.bodyLines.join(" ")}`;

    // Category detection
    let category = "Web Application";
    if (/mobile|flutter|react native|android|ios|swift|kotlin/i.test(fullText)) {
      category = "Mobile Application";
    } else if (/saas|subscription|cloud suite|b2b/i.test(fullText)) {
      category = "SaaS";
    } else if (/e-commerce|store|shop|cart|stripe|checkout|shopping/i.test(fullText)) {
      category = "E-commerce";
    } else if (/university|school|student|academic|faculty|campus/i.test(fullText)) {
      category = "University Platform";
    } else if (/insurance|fintech|banking|wallet|policy/i.test(fullText)) {
      category = "Web Application";
    } else if (/api|backend|microservice|rest/i.test(fullText)) {
      category = "API / Backend";
    }

    // Extract title from header line
    const dateInfo = extractDatesFromLine(raw.headerLine);
    let titleStr = raw.headerLine;
    if (dateInfo) {
      titleStr = titleStr.replace(dateInfo.matchedText, "").trim();
    }
    const parts = titleStr
      .split(/[\–\—\|\:]\s*/)
      .map((s) => s.trim())
      .filter(Boolean);

    const title = parts[0] || `Project ${idx + 1}`;

    // Extract links
    const githubMatch = fullText.match(/https?:\/\/github\.com\/[^\s\)\>]+/i);
    const liveMatch = fullText.match(
      /https?:\/\/(?!github\.com)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}[^\s\)\>]*/i
    );

    // Bullets
    const bulletList: string[] = [];
    raw.bodyLines.forEach((b) => {
      const cleaned = b.replace(BULLET_CHAR_REGEX, "").trim();
      if (cleaned) {
        bulletList.push(`• ${cleaned}`);
      }
    });

    let short_description = "";
    if (bulletList.length > 0) {
      short_description = bulletList[0].replace(/^•\s*/, "");
    } else {
      short_description = `Engineered ${title}, a high-performance ${category.toLowerCase()}.`;
    }

    const description =
      bulletList.length > 0
        ? bulletList.join("\n")
        : `• Built core features and architecture for ${title}.`;

    const technologies = extractTechnologies(fullText);

    projects.push({
      id: `proj-parsed-${idx + 1}-${Date.now()}`,
      title: title.slice(0, 80),
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
      category,
      short_description: short_description.slice(0, 250),
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
      "start_date": "Mon Year or Year (e.g. Mar 2026)",
      "end_date": "Mon Year or Year or null",
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
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

    let cleaned = rawContent.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    const parsed = JSON.parse(cleaned);


    const experiences: ParsedExperience[] = (parsed.experiences || []).map(
      (exp: any, idx: number) => ({
        id: `gemini-exp-${idx + 1}-${Date.now()}`,
        company: exp.company || "Company",
        position: exp.position || "Developer",
        start_date: exp.start_date || "2024",
        end_date: exp.end_date || null,
        current: Boolean(exp.current),
        description: exp.description || "",
        technologies: exp.technologies || [],
        selected: true,
        imported: false,
      })
    );

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
