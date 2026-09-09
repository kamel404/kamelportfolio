"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ---------------------------------------------------------
// Auth Actions
// ---------------------------------------------------------

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/admin/login");
}

// ---------------------------------------------------------
// Profile Action
// ---------------------------------------------------------

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const cvFile = formData.get("cv_file") as File | null;
  let cv_url = (formData.get("cv_url") as string) || null;

  // Process uploaded CV file if present
  if (cvFile && cvFile.size > 0) {
    try {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      const ext = cvFile.name.split(".").pop() || "pdf";
      const cleanFileName = `kamel-faour-cv-${Date.now()}.${ext}`;

      // 1. Try uploading to Supabase Storage bucket 'portfolio-images'
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(`cv/${cleanFileName}`, buffer, {
          contentType: cvFile.type || "application/pdf",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(uploadData.path);
        cv_url = publicUrlData.publicUrl;
      } else {
        // 2. Fallback to saving to local public/uploads directory
        const fs = await import("fs/promises");
        const path = await import("path");
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadsDir, { recursive: true });
        await fs.writeFile(path.join(uploadsDir, cleanFileName), buffer);
        cv_url = `/uploads/${cleanFileName}`;
      }
    } catch (err) {
      console.error("Error processing CV file upload:", err);
    }
  }

  const data = {
    name: formData.get("name") as string,
    title: formData.get("title") as string,
    short_bio: formData.get("short_bio") as string,
    long_bio: formData.get("long_bio") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    linkedin_url: (formData.get("linkedin_url") as string) || null,
    github_url: (formData.get("github_url") as string) || null,
    cv_url,
    profile_image_url: (formData.get("profile_image_url") as string) || null,
    location: (formData.get("location") as string) || null,
    availability_status: (formData.get("availability_status") as string) || null,
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase.from("profile").select("id").limit(1).single();

  let res;
  if (existing) {
    res = await supabase.from("profile").update(data).eq("id", existing.id);
  } else {
    res = await supabase.from("profile").insert([data]);
  }

  if (res.error) {
    console.error("Error updating profile:", res.error.message);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}

// ---------------------------------------------------------
// Project Actions
// ---------------------------------------------------------

export async function saveProject(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const short_description = formData.get("short_description") as string;
  const description = (formData.get("description") as string) || "";
  const category = (formData.get("category") as string) || "Web Application";
  const github_url = (formData.get("github_url") as string) || null;
  const live_url = (formData.get("live_url") as string) || null;
  const image_url = (formData.get("image_url") as string) || null;
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;

  const projectPayload = {
    title,
    slug,
    short_description,
    description,
    category,
    github_url,
    live_url,
    image_url,
    featured,
    published,
    sort_order,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (id) {
    res = await supabase.from("projects").update(projectPayload).eq("id", id);
  } else {
    res = await supabase.from("projects").insert([projectPayload]);
  }

  if (res.error) {
    console.error("Error saving project:", res.error.message);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

// ---------------------------------------------------------
// Experience Actions
// ---------------------------------------------------------

export async function saveExperience(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const description = formData.get("description") as string;
  const start_date = formData.get("start_date") as string;
  const current = formData.get("current") === "on";
  const end_date = current ? null : ((formData.get("end_date") as string) || null);
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;

  const payload = {
    company,
    position,
    description,
    start_date,
    end_date,
    current,
    sort_order,
    updated_at: new Date().toISOString(),
  };

  let res;
  if (id) {
    res = await supabase.from("experiences").update(payload).eq("id", id);
  } else {
    res = await supabase.from("experiences").insert([payload]);
  }

  if (res.error) {
    console.error("Error saving experience:", res.error.message);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/experience");
  redirect("/admin/experience");
}

export async function deleteExperience(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) {
    console.error("Error deleting experience:", error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/experience");
}

// ---------------------------------------------------------
// Skill Actions
// ---------------------------------------------------------

export async function saveSkill(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const sort_order = parseInt(formData.get("sort_order") as string, 10) || 0;

  const payload = {
    name,
    category,
    sort_order,
  };

  let res;
  if (id) {
    res = await supabase.from("skills").update(payload).eq("id", id);
  } else {
    res = await supabase.from("skills").insert([payload]);
  }

  if (res.error) {
    console.error("Error saving skill:", res.error.message);
    return;
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills");
}

export async function deleteSkill(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);

  if (error) {
    console.error("Error deleting skill:", error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");
}

// ---------------------------------------------------------
// CV Bulk Import Actions
// ---------------------------------------------------------

export interface ExperienceImportItem {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  sort_order?: number;
}

export async function importExperiences(items: ExperienceImportItem[]) {
  if (!items || items.length === 0) {
    return { success: false, error: "No experiences provided to import." };
  }

  const supabase = await createClient();

  // Find the highest sort_order currently
  const { data: existing } = await supabase
    .from("experiences")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  const startOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const records = items.map((item, index) => ({
    company: item.company,
    position: item.position,
    description: item.description,
    start_date: item.start_date,
    end_date: item.current ? null : (item.end_date || null),
    current: Boolean(item.current),
    sort_order: item.sort_order ?? (startOrder + index),
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase.from("experiences").insert(records).select("id");

  if (error) {
    console.error("Error importing experiences:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/experience");

  return { success: true, count: data?.length || records.length };
}

export interface ProjectImportItem {
  title: string;
  slug?: string;
  category: string;
  short_description: string;
  description?: string;
  github_url?: string | null;
  live_url?: string | null;
  image_url?: string | null;
  featured?: boolean;
  published?: boolean;
  sort_order?: number;
  technologies?: string[];
}

export async function importProjects(items: ProjectImportItem[]) {
  if (!items || items.length === 0) {
    return { success: false, error: "No projects provided to import." };
  }

  const supabase = await createClient();

  // Find highest sort_order and existing slugs
  const { data: existing } = await supabase
    .from("projects")
    .select("sort_order, slug")
    .order("sort_order", { ascending: false });

  const startOrder = (existing?.[0]?.sort_order ?? 0) + 1;
  const existingSlugs = new Set((existing || []).map((p: any) => p.slug));

  let importedCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const baseSlug =
      item.slug ||
      item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") ||
      "project";
    let finalSlug = baseSlug;
    let counter = 1;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    existingSlugs.add(finalSlug);

    const projectPayload = {
      title: item.title,
      slug: finalSlug,
      short_description: item.short_description,
      description: item.description || "",
      category: item.category || "Web Application",
      github_url: item.github_url || null,
      live_url: item.live_url || null,
      image_url: item.image_url || null,
      featured: Boolean(item.featured),
      published: item.published !== false,
      sort_order: item.sort_order ?? (startOrder + i),
      updated_at: new Date().toISOString(),
    };

    const { data: insertedProject, error: projectError } = await supabase
      .from("projects")
      .insert([projectPayload])
      .select("id")
      .single();

    if (projectError) {
      console.error("Error importing project:", projectError.message);
      continue;
    }

    importedCount++;

    // Associate technologies if provided
    if (insertedProject && item.technologies && item.technologies.length > 0) {
      try {
        for (const techName of item.technologies) {
          const trimmed = techName.trim();
          if (!trimmed) continue;

          // Upsert technology
          const { data: techRecord } = await supabase
            .from("technologies")
            .upsert({ name: trimmed }, { onConflict: "name" })
            .select("id")
            .single();

          if (techRecord?.id) {
            await supabase
              .from("project_technologies")
              .upsert(
                { project_id: insertedProject.id, technology_id: techRecord.id },
                { onConflict: "project_id,technology_id" }
              );
          }
        }
      } catch (techErr) {
        console.warn("Error associating technologies with imported project:", techErr);
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");

  return { success: true, count: importedCount };
}

