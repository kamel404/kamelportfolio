"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Trash2,
  Plus,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Briefcase,
  FolderGit2,
} from "lucide-react";
import { importExperiences, importProjects } from "@/app/admin/actions";
import { ParsedExperience, ParsedProject } from "@/lib/cv-parser";

interface CvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target?: "experience" | "projects" | "all";
  currentCvUrl?: string | null;
  onFillExperienceForm?: (exp: ParsedExperience) => void;
  onFillProjectForm?: (proj: ParsedProject) => void;
  onSuccess?: () => void;
}

export function CvImportModal({
  isOpen,
  onClose,
  target = "experience",
  currentCvUrl,
  onFillExperienceForm,
  onFillProjectForm,
  onSuccess,
}: CvImportModalProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "projects">(
    target === "projects" ? "projects" : "experience"
  );
  const [step, setStep] = useState<"upload" | "review">("upload");
  const [uploadMethod, setUploadMethod] = useState<"file" | "profile" | "text">("file");

  // File / Input States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showAiConfig, setShowAiConfig] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsing & Loading States
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Review Items States
  const [experiences, setExperiences] = useState<ParsedExperience[]>([]);
  const [projects, setProjects] = useState<ParsedProject[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleParseCv = async (methodOverride?: "file" | "profile" | "text") => {
    const method = methodOverride || uploadMethod;
    setParseError(null);
    setIsParsing(true);

    try {
      const formData = new FormData();
      formData.append("target", target);
      if (geminiApiKey.trim()) {
        formData.append("gemini_api_key", geminiApiKey.trim());
      }

      if (method === "profile" && currentCvUrl) {
        formData.append("cv_url", currentCvUrl);
      } else if (method === "text") {
        if (!pastedText.trim()) {
          setParseError("Please paste some CV or resume text.");
          setIsParsing(false);
          return;
        }
        formData.append("raw_text", pastedText.trim());
      } else {
        if (!selectedFile) {
          setParseError("Please select or drop a CV file first.");
          setIsParsing(false);
          return;
        }
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/admin/parse-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to parse CV document.");
      }

      const parsedExp: ParsedExperience[] = data.data.experiences || [];
      const parsedProj: ParsedProject[] = data.data.projects || [];

      setExperiences(parsedExp);
      setProjects(parsedProj);

      if (target === "experience" && parsedExp.length === 0) {
        setParseError("No experience entries could be detected in this CV. You can try pasting the text or manually add them.");
      } else if (target === "projects" && parsedProj.length === 0) {
        setParseError("No projects could be detected in this CV. You can try pasting the text or manually add them.");
      } else {
        setStep("review");
      }
    } catch (err: any) {
      setParseError(err.message || "An unexpected error occurred while parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  // Experience Mutations
  const updateExperience = (id: string, field: keyof ParsedExperience, value: any) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
  };

  const toggleSelectAllExperiences = (select: boolean) => {
    setExperiences((prev) => prev.map((exp) => ({ ...exp, selected: select })));
  };

  // Project Mutations
  const updateProject = (id: string, field: keyof ParsedProject, value: any) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleSelectAllProjects = (select: boolean) => {
    setProjects((prev) => prev.map((p) => ({ ...p, selected: select })));
  };

  // Import Single Experience
  const handleImportSingleExperience = async (exp: ParsedExperience) => {
    try {
      updateExperience(exp.id, "imported", false);
      const res = await importExperiences([
        {
          company: exp.company,
          position: exp.position,
          description: exp.description,
          start_date: exp.start_date,
          end_date: exp.current ? null : exp.end_date,
          current: exp.current,
        },
      ]);

      if (res.success) {
        updateExperience(exp.id, "imported", true);
        if (onSuccess) onSuccess();
      } else {
        alert(res.error || "Failed to import experience");
      }
    } catch (err: any) {
      alert(err.message || "Failed to import experience");
    }
  };

  // Import Single Project
  const handleImportSingleProject = async (proj: ParsedProject) => {
    try {
      updateProject(proj.id, "imported", false);
      const res = await importProjects([
        {
          title: proj.title,
          slug: proj.slug,
          category: proj.category,
          short_description: proj.short_description,
          description: proj.description,
          github_url: proj.github_url || null,
          live_url: proj.live_url || null,
          technologies: proj.technologies,
          featured: proj.featured,
          published: proj.published,
        },
      ]);

      if (res.success) {
        updateProject(proj.id, "imported", true);
        if (onSuccess) onSuccess();
      } else {
        alert(res.error || "Failed to import project");
      }
    } catch (err: any) {
      alert(err.message || "Failed to import project");
    }
  };

  // Batch Import Selected Experiences
  const handleBatchImportExperiences = async () => {
    const selected = experiences.filter((e) => e.selected && !e.imported);
    if (selected.length === 0) {
      alert("Please select at least one experience to import.");
      return;
    }

    setIsImporting(true);
    setImportMessage(null);

    try {
      const payload = selected.map((exp) => ({
        company: exp.company,
        position: exp.position,
        description: exp.description,
        start_date: exp.start_date,
        end_date: exp.current ? null : exp.end_date,
        current: exp.current,
      }));

      const res = await importExperiences(payload);
      if (res.success) {
        setExperiences((prev) =>
          prev.map((e) => (e.selected ? { ...e, imported: true } : e))
        );
        setImportMessage(`Successfully imported ${res.count} experience(s)!`);
        if (onSuccess) onSuccess();
      } else {
        setParseError(res.error || "Failed to import experiences.");
      }
    } catch (err: any) {
      setParseError(err.message || "Failed to import experiences.");
    } finally {
      setIsImporting(false);
    }
  };

  // Batch Import Selected Projects
  const handleBatchImportProjects = async () => {
    const selected = projects.filter((p) => p.selected && !p.imported);
    if (selected.length === 0) {
      alert("Please select at least one project to import.");
      return;
    }

    setIsImporting(true);
    setImportMessage(null);

    try {
      const payload = selected.map((proj) => ({
        title: proj.title,
        slug: proj.slug,
        category: proj.category,
        short_description: proj.short_description,
        description: proj.description,
        github_url: proj.github_url || null,
        live_url: proj.live_url || null,
        technologies: proj.technologies,
        featured: proj.featured,
        published: proj.published,
      }));

      const res = await importProjects(payload);
      if (res.success) {
        setProjects((prev) =>
          prev.map((p) => (p.selected ? { ...p, imported: true } : p))
        );
        setImportMessage(`Successfully imported ${res.count} project(s)!`);
        if (onSuccess) onSuccess();
      } else {
        setParseError(res.error || "Failed to import projects.");
      }
    } catch (err: any) {
      setParseError(err.message || "Failed to import projects.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddNewManualExperience = () => {
    const newExp: ParsedExperience = {
      id: `manual-exp-${Date.now()}`,
      company: "",
      position: "",
      start_date: new Date().getFullYear().toString(),
      end_date: null,
      current: true,
      description: "• ",
      technologies: [],
      selected: true,
      imported: false,
    };
    setExperiences((prev) => [newExp, ...prev]);
  };

  const handleAddNewManualProject = () => {
    const newProj: ParsedProject = {
      id: `manual-proj-${Date.now()}`,
      title: "",
      category: "Web Application",
      short_description: "",
      description: "• ",
      github_url: "",
      live_url: "",
      technologies: [],
      featured: false,
      published: true,
      selected: true,
      imported: false,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-[#E4E1D8] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4E1D8] bg-[#F7F6F2]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D97757]/10 text-[#D97757] rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1F1F1C]">
                {step === "upload" ? "Import from CV / Resume" : "Review & Edit Extracted Items"}
              </h2>
              <p className="text-xs text-[#6B6A63]">
                {step === "upload"
                  ? "Upload your document or paste text to extract experience and projects in seconds."
                  : "Review, edit fields, select items, and import directly into your portfolio."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher if in Review mode with both or target='all' */}
        {step === "review" && target === "all" && (
          <div className="flex border-b border-[#E4E1D8] px-6 bg-[#F7F6F2]/50">
            <button
              onClick={() => setActiveTab("experience")}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "experience"
                  ? "border-[#D97757] text-[#D97757]"
                  : "border-transparent text-[#6B6A63] hover:text-[#1F1F1C]"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Experiences ({experiences.length})
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === "projects"
                  ? "border-[#D97757] text-[#D97757]"
                  : "border-transparent text-[#6B6A63] hover:text-[#1F1F1C]"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              Projects ({projects.length})
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {parseError && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p className="font-semibold">Import Error</p>
                <p className="mt-0.5">{parseError}</p>
              </div>
              <button
                onClick={() => setParseError(null)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {importMessage && (
            <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{importMessage}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD & PARSE */}
          {step === "upload" && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              {/* Method Tabs */}
              <div className="flex rounded-lg bg-[#EDE8DE]/60 p-1 border border-[#E4E1D8] text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setUploadMethod("file")}
                  className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                    uploadMethod === "file"
                      ? "bg-white text-[#1F1F1C] shadow-xs font-semibold"
                      : "text-[#6B6A63] hover:text-[#1F1F1C]"
                  }`}
                >
                  Upload File (PDF / DOCX)
                </button>

                {currentCvUrl && (
                  <button
                    type="button"
                    onClick={() => setUploadMethod("profile")}
                    className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                      uploadMethod === "profile"
                        ? "bg-white text-[#1F1F1C] shadow-xs font-semibold"
                        : "text-[#6B6A63] hover:text-[#1F1F1C]"
                    }`}
                  >
                    Use Saved Profile CV
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setUploadMethod("text")}
                  className={`flex-1 py-2 rounded-md transition-all cursor-pointer ${
                    uploadMethod === "text"
                      ? "bg-white text-[#1F1F1C] shadow-xs font-semibold"
                      : "text-[#6B6A63] hover:text-[#1F1F1C]"
                  }`}
                >
                  Paste Text Directly
                </button>
              </div>

              {/* Upload File Tab */}
              {uploadMethod === "file" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-[#D97757] bg-[#D97757]/5 scale-[0.99]"
                        : "border-[#E4E1D8] bg-[#F7F6F2]/60 hover:border-[#D97757]/60 hover:bg-[#EDE8DE]/30"
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-between p-4 bg-white border border-[#E4E1D8] rounded-xl shadow-xs">
                        <div className="flex items-center gap-3 truncate text-left">
                          <div className="p-2.5 bg-[#D97757]/10 rounded-lg text-[#D97757] shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="truncate">
                            <p className="text-sm font-semibold text-[#1F1F1C] truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-[#6B6A63] mt-0.5">
                              {(selectedFile.size / 1024).toFixed(1)} KB • Ready to extract
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="p-1.5 text-[#6B6A63] hover:text-red-600 rounded-md"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-3.5 bg-[#EDE8DE] rounded-xl text-[#D97757]">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1F1F1C]">
                            Drag and drop your CV file here, or{" "}
                            <span className="text-[#D97757] underline underline-offset-2">
                              browse
                            </span>
                          </p>
                          <p className="text-xs text-[#6B6A63] mt-1">
                            Supports PDF, DOC, DOCX, and TXT files
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Use Saved Profile CV Tab */}
              {uploadMethod === "profile" && currentCvUrl && (
                <div className="p-6 bg-white border border-[#E4E1D8] rounded-xl text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 mx-auto bg-[#D97757]/10 text-[#D97757] rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1F1F1C]">
                      Existing CV on File
                    </h3>
                    <p className="text-xs text-[#6B6A63] mt-1 font-mono">
                      {currentCvUrl.split("/").pop()}
                    </p>
                    <p className="text-xs text-[#6B6A63] mt-2">
                      Parse experiences and projects directly from your profile's saved CV without re-uploading.
                    </p>
                  </div>
                </div>
              )}

              {/* Paste Raw Text Tab */}
              {uploadMethod === "text" && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C]">
                    Paste Resume / CV Text
                  </label>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste the text from your CV or LinkedIn profile here..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-xs"
                  />
                </div>
              )}

              {/* Optional AI Config Accordion */}
              <div className="pt-2 border-t border-[#E4E1D8]">
                <button
                  type="button"
                  onClick={() => setShowAiConfig(!showAiConfig)}
                  className="flex items-center gap-1.5 text-xs text-[#6B6A63] hover:text-[#1F1F1C] font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D97757]" />
                  <span>Optional: AI-Enhanced Parsing Settings</span>
                  <span className="text-[10px] text-[#D97757] bg-[#D97757]/10 px-1.5 py-0.5 rounded">
                    Built-in parser active
                  </span>
                </button>

                {showAiConfig && (
                  <div className="mt-3 p-3.5 bg-[#F7F6F2] border border-[#E4E1D8] rounded-xl space-y-2 text-xs">
                    <label className="block font-semibold text-[#1F1F1C]">
                      Gemini API Key (Optional)
                    </label>
                    <input
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy... (leave blank to use built-in smart parser)"
                      className="w-full px-3 py-2 rounded-lg border border-[#E4E1D8] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                    />
                    <p className="text-[11px] text-[#6B6A63]">
                      The built-in parser works immediately with zero API keys. You can optionally provide a Gemini API key for advanced ATS-level deep reasoning.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={
                    isParsing ||
                    (uploadMethod === "file" && !selectedFile) ||
                    (uploadMethod === "text" && !pastedText.trim())
                  }
                  onClick={() => handleParseCv()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Parsing CV...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Extract & Review Items
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REVIEW & EDIT */}
          {step === "review" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F7F6F2] border border-[#E4E1D8] rounded-xl">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "experience") {
                        const allSelected = experiences.every((e) => e.selected);
                        toggleSelectAllExperiences(!allSelected);
                      } else {
                        const allSelected = projects.every((p) => p.selected);
                        toggleSelectAllProjects(!allSelected);
                      }
                    }}
                    className="text-xs font-semibold text-[#D97757] hover:underline cursor-pointer"
                  >
                    {activeTab === "experience"
                      ? experiences.every((e) => e.selected)
                        ? "Deselect All"
                        : "Select All"
                      : projects.every((p) => p.selected)
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                  <span className="text-xs text-[#6B6A63]">|</span>
                  <span className="text-xs text-[#6B6A63]">
                    {activeTab === "experience"
                      ? `${experiences.filter((e) => e.selected).length} of ${experiences.length} selected`
                      : `${projects.filter((p) => p.selected).length} of ${projects.length} selected`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeTab === "experience") handleAddNewManualExperience();
                      else handleAddNewManualProject();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4E1D8] hover:bg-[#EDE8DE] text-[#1F1F1C] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("upload")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E4E1D8] hover:bg-[#EDE8DE] text-[#6B6A63] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Upload Different CV
                  </button>

                  {activeTab === "experience" ? (
                    <button
                      type="button"
                      disabled={isImporting || experiences.filter((e) => e.selected && !e.imported).length === 0}
                      onClick={handleBatchImportExperiences}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isImporting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Import Selected ({experiences.filter((e) => e.selected && !e.imported).length})
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isImporting || projects.filter((p) => p.selected && !p.imported).length === 0}
                      onClick={handleBatchImportProjects}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D97757] hover:bg-[#B9573D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isImporting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Import Selected ({projects.filter((p) => p.selected && !p.imported).length})
                    </button>
                  )}
                </div>
              </div>

              {/* EXPERIENCES REVIEW CARDS */}
              {activeTab === "experience" && (
                <div className="space-y-4">
                  {experiences.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#6B6A63]">
                      No experience items found. Click "+ Add Item" above or re-upload a CV.
                    </div>
                  ) : (
                    experiences.map((exp, index) => (
                      <div
                        key={exp.id}
                        className={`p-4 sm:p-5 rounded-xl border transition-all ${
                          exp.imported
                            ? "bg-emerald-50/50 border-emerald-200"
                            : exp.selected
                            ? "bg-white border-[#D97757]/40 shadow-xs"
                            : "bg-[#F7F6F2]/60 border-[#E4E1D8] opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E1D8]">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={exp.selected}
                              onChange={(e) => updateExperience(exp.id, "selected", e.target.checked)}
                              className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757] cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1F1F1C]">
                              #{index + 1} {exp.position || "Untitled Role"}
                              {exp.company ? ` at ${exp.company}` : ""}
                            </span>
                            {exp.imported && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                Imported
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {onFillExperienceForm && (
                              <button
                                type="button"
                                onClick={() => {
                                  onFillExperienceForm(exp);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-xs font-medium text-[#6B6A63] hover:text-[#1F1F1C] bg-white border border-[#E4E1D8] rounded-md hover:bg-[#EDE8DE] transition-colors cursor-pointer"
                                title="Fill the main Add Experience form with this item"
                              >
                                Fill into Form
                              </button>
                            )}

                            {!exp.imported && (
                              <button
                                type="button"
                                onClick={() => handleImportSingleExperience(exp)}
                                className="px-2.5 py-1 text-xs font-semibold text-[#D97757] bg-[#D97757]/10 hover:bg-[#D97757]/20 rounded-md transition-colors cursor-pointer"
                              >
                                Import Now
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              className="p-1 text-[#6B6A63] hover:text-red-600 rounded cursor-pointer"
                              title="Discard"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editable Experience Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Company / Organization *
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Position / Role *
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Start Date *
                            </label>
                            <input
                              type="text"
                              value={exp.start_date}
                              onChange={(e) => updateExperience(exp.id, "start_date", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              End Date
                            </label>
                            <input
                              type="text"
                              disabled={exp.current}
                              value={exp.current ? "Present" : exp.end_date || ""}
                              onChange={(e) => updateExperience(exp.id, "end_date", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 disabled:bg-[#F7F6F2] disabled:text-[#6B6A63]"
                            />
                          </div>

                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs text-[#1F1F1C] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={exp.current}
                                onChange={(e) => {
                                  updateExperience(exp.id, "current", e.target.checked);
                                  if (e.target.checked) {
                                    updateExperience(exp.id, "end_date", null);
                                  }
                                }}
                                className="w-3.5 h-3.5 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
                              />
                              <span>Currently working here</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                            Description / Bullet points *
                          </label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* PROJECTS REVIEW CARDS */}
              {activeTab === "projects" && (
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="text-center py-10 text-xs text-[#6B6A63]">
                      No project items found. Click "+ Add Item" above or re-upload a CV.
                    </div>
                  ) : (
                    projects.map((proj, index) => (
                      <div
                        key={proj.id}
                        className={`p-4 sm:p-5 rounded-xl border transition-all ${
                          proj.imported
                            ? "bg-emerald-50/50 border-emerald-200"
                            : proj.selected
                            ? "bg-white border-[#D97757]/40 shadow-xs"
                            : "bg-[#F7F6F2]/60 border-[#E4E1D8] opacity-70"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E4E1D8]">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={proj.selected}
                              onChange={(e) => updateProject(proj.id, "selected", e.target.checked)}
                              className="w-4 h-4 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757] cursor-pointer"
                            />
                            <span className="text-xs font-bold text-[#1F1F1C]">
                              #{index + 1} {proj.title || "Untitled Project"}
                            </span>
                            <span className="text-[10px] bg-[#EDE8DE] text-[#6B6A63] px-2 py-0.5 rounded font-medium">
                              {proj.category}
                            </span>
                            {proj.imported && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" />
                                Imported
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {onFillProjectForm && (
                              <button
                                type="button"
                                onClick={() => {
                                  onFillProjectForm(proj);
                                  onClose();
                                }}
                                className="px-2.5 py-1 text-xs font-medium text-[#6B6A63] hover:text-[#1F1F1C] bg-white border border-[#E4E1D8] rounded-md hover:bg-[#EDE8DE] transition-colors cursor-pointer"
                                title="Fill the active project form with this item"
                              >
                                Fill into Form
                              </button>
                            )}

                            {!proj.imported && (
                              <button
                                type="button"
                                onClick={() => handleImportSingleProject(proj)}
                                className="px-2.5 py-1 text-xs font-semibold text-[#D97757] bg-[#D97757]/10 hover:bg-[#D97757]/20 rounded-md transition-colors cursor-pointer"
                              >
                                Import Now
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => removeProject(proj.id)}
                              className="p-1 text-[#6B6A63] hover:text-red-600 rounded cursor-pointer"
                              title="Discard"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editable Project Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Category *
                            </label>
                            <select
                              value={proj.category}
                              onChange={(e) => updateProject(proj.id, "category", e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            >
                              <option value="Web Application">Web Application</option>
                              <option value="Mobile Application">Mobile Application</option>
                              <option value="SaaS">SaaS</option>
                              <option value="E-commerce">E-commerce</option>
                              <option value="University Platform">University Platform</option>
                              <option value="API / Backend">API / Backend</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                            Short Description *
                          </label>
                          <textarea
                            rows={2}
                            value={proj.short_description}
                            onChange={(e) => updateProject(proj.id, "short_description", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                            Detailed Description / Highlights
                          </label>
                          <textarea
                            rows={3}
                            value={proj.description || ""}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              Technologies (comma-separated)
                            </label>
                            <input
                              type="text"
                              value={(proj.technologies || []).join(", ")}
                              onChange={(e) =>
                                updateProject(
                                  proj.id,
                                  "technologies",
                                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                                )
                              }
                              placeholder="React, Next.js, PostgreSQL"
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40 font-mono text-[11px]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B6A63] mb-1">
                              GitHub Repo URL
                            </label>
                            <input
                              type="text"
                              value={proj.github_url || ""}
                              onChange={(e) => updateProject(proj.id, "github_url", e.target.value)}
                              placeholder="https://github.com/..."
                              className="w-full px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs text-[#1F1F1C] focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-6 pt-1">
                          <label className="flex items-center gap-2 text-xs text-[#1F1F1C] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proj.featured}
                              onChange={(e) => updateProject(proj.id, "featured", e.target.checked)}
                              className="w-3.5 h-3.5 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
                            />
                            <span>Featured on Homepage</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs text-[#1F1F1C] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={proj.published}
                              onChange={(e) => updateProject(proj.id, "published", e.target.checked)}
                              className="w-3.5 h-3.5 text-[#D97757] rounded border-[#E4E1D8] focus:ring-[#D97757]"
                            />
                            <span>Published (Public)</span>
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E4E1D8] bg-[#F7F6F2]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE] rounded-lg transition-colors cursor-pointer"
          >
            {step === "review" ? "Close & Return" : "Cancel"}
          </button>

          {step === "review" && (
            <div className="flex items-center gap-3">
              {activeTab === "experience" ? (
                <button
                  type="button"
                  disabled={isImporting || experiences.filter((e) => e.selected && !e.imported).length === 0}
                  onClick={handleBatchImportExperiences}
                  className="flex items-center gap-2 px-5 py-2 bg-[#D97757] hover:bg-[#B9573D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isImporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Import Selected Experiences ({experiences.filter((e) => e.selected && !e.imported).length})
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isImporting || projects.filter((p) => p.selected && !p.imported).length === 0}
                  onClick={handleBatchImportProjects}
                  className="flex items-center gap-2 px-5 py-2 bg-[#D97757] hover:bg-[#B9573D] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isImporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Import Selected Projects ({projects.filter((p) => p.selected && !p.imported).length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
