import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Validate mime type
    const validMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
      "image/avif",
    ];

    if (!validMimeTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PNG, JPG, WEBP, GIF, or SVG image." },
        { status: 400 }
      );
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawExt = file.name.split(".").pop() || "jpg";
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanFileName = `${folder}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    let finalUrl = "";
    const supabase = await createClient();

    // 1. Try uploading to Supabase Storage bucket 'portfolio-images'
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("portfolio-images")
        .upload(`${folder}/${cleanFileName}`, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("portfolio-images")
          .getPublicUrl(uploadData.path);
        finalUrl = publicUrlData.publicUrl;
      }
    } catch (storageErr) {
      console.warn("Supabase storage upload attempt failed, falling back to local storage:", storageErr);
    }

    // 2. Fallback to saving to public/uploads directory if Supabase storage failed or was not configured
    if (!finalUrl) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, cleanFileName);
      await fs.writeFile(filePath, buffer);
      finalUrl = `/uploads/${cleanFileName}`;
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileName: cleanFileName,
    });
  } catch (error: any) {
    console.error("Error in /api/admin/upload-image:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
