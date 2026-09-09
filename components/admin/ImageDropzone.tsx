"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Link2,
} from "lucide-react";

interface ImageDropzoneProps {
  value?: string | null;
  onChange: (url: string) => void;
  name?: string;
  label?: string;
  folder?: string;
  helperText?: string;
}

export function ImageDropzone({
  value = "",
  onChange,
  name = "image_url",
  label = "Project Cover Image / Photo",
  folder = "projects",
  helperText = "Drag and drop your image file here, or browse. Supports PNG, JPG, WEBP, GIF up to 10MB.",
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setManualUrl(data.url);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await uploadFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await uploadFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setManualUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleManualUrlBlur = () => {
    if (manualUrl.trim() !== value) {
      onChange(manualUrl.trim());
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-[#6B6A63] hover:text-[#D97757] inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{showUrlInput ? "Drop file instead" : "or paste image URL"}</span>
        </button>
      </div>

      {/* Hidden input to pass value in standard HTML forms */}
      <input type="hidden" name={name} value={value || ""} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Mode 1: Manual URL input */}
      {showUrlInput && (
        <div className="space-y-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => {
              setManualUrl(e.target.value);
              onChange(e.target.value);
            }}
            onBlur={handleManualUrlBlur}
            placeholder="https://images.unsplash.com/... or /uploads/..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
          />
        </div>
      )}

      {/* Mode 2: Drag & Drop zone with live preview */}
      {!showUrlInput && (
        <>
          {value ? (
            /* Selected / Uploaded Image Preview Card */
            <div className="relative p-3 sm:p-4 bg-white border border-[#E4E1D8] rounded-xl flex flex-col sm:flex-row items-center gap-4 shadow-xs">
              <div className="relative w-full sm:w-28 h-28 bg-[#EDE8DE] rounded-lg overflow-hidden shrink-0 border border-[#E4E1D8]">
                {/* Visual Image Preview */}
                <Image
                  src={value}
                  alt="Uploaded photo preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Photo Ready</span>
                </div>
                <p className="text-xs text-[#1F1F1C] font-mono truncate mt-1">
                  {value.split("/").pop()}
                </p>
                <p className="text-[11px] text-[#6B6A63] truncate mt-0.5 max-w-sm">
                  {value}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1F1F1C] bg-[#F7F6F2] hover:bg-[#EDE8DE] border border-[#E4E1D8] rounded-md transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Change Image
                  </button>

                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-transparent rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              {isUploading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#D97757]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading new image...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Dropzone Prompt */
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-[#D97757] bg-[#D97757]/5 scale-[0.99]"
                  : "border-[#E4E1D8] bg-[#F7F6F2]/60 hover:border-[#D97757]/60 hover:bg-[#EDE8DE]/30"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#D97757]" />
                  <p className="text-sm font-semibold text-[#1F1F1C]">Uploading image...</p>
                  <p className="text-xs text-[#6B6A63]">Please wait while your image is saved</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="p-3 bg-[#EDE8DE] rounded-xl text-[#D97757]">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1F1F1C]">
                      Drag and drop your photo here, or{" "}
                      <span className="text-[#D97757] underline underline-offset-2">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-[#6B6A63] mt-1">{helperText}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {uploadError && (
        <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
