import { NextRequest, NextResponse } from "next/server";
import { extractTextFromCvFile, parseCvContent } from "@/lib/cv-parser";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const cvUrl = (formData.get("cv_url") as string) || "";
    const rawText = (formData.get("raw_text") as string) || "";
    const target = ((formData.get("target") as string) || "all") as "experience" | "projects" | "all";
    const apiKey = (formData.get("gemini_api_key") as string) || "";

    let textToParse = "";

    if (rawText && rawText.trim().length > 0) {
      textToParse = rawText.trim();
    } else if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      textToParse = await extractTextFromCvFile(buffer, file.name, file.type);
    } else if (cvUrl) {
      if (cvUrl.startsWith("/uploads/")) {
        const localPath = path.join(process.cwd(), "public", cvUrl.replace(/^\//, ""));
        const buffer = await fs.readFile(localPath);
        const fileName = path.basename(localPath);
        textToParse = await extractTextFromCvFile(buffer, fileName);
      } else if (cvUrl.startsWith("http://") || cvUrl.startsWith("https://")) {
        const res = await fetch(cvUrl);
        if (!res.ok) {
          return NextResponse.json(
            { error: `Failed to download CV file from URL (${res.statusText})` },
            { status: 400 }
          );
        }
        const buffer = Buffer.from(await res.arrayBuffer());
        const fileName = cvUrl.split("/").pop() || "cv.pdf";
        textToParse = await extractTextFromCvFile(buffer, fileName);
      }
    }

    if (!textToParse || textToParse.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Could not extract any text from the provided CV. Please upload a valid PDF, DOCX, or paste the text directly.",
        },
        { status: 400 }
      );
    }

    const parseResult = await parseCvContent(textToParse, target, apiKey);

    return NextResponse.json({
      success: true,
      data: parseResult,
    });
  } catch (error: any) {
    console.error("Error in /api/admin/parse-cv:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process and parse CV document." },
      { status: 500 }
    );
  }
}
