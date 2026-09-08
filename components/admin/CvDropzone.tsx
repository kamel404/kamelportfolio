"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, X, Download } from "lucide-react";

interface CvDropzoneProps {
  currentCvUrl?: string | null;
}

export function CvDropzone({ currentCvUrl }: CvDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Sync with the hidden file input so form submission receives it
      if (inputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        inputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        name="cv_file"
        accept=".pdf,.doc,.docx,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hidden input to preserve existing URL if no new file is uploaded */}
      <input
        type="hidden"
        name="cv_url"
        value={currentCvUrl || ""}
      />

      {/* Drop Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-[#D97757] bg-[#D97757]/5 scale-[0.99]"
            : "border-[#E4E1D8] bg-[#F7F6F2]/60 hover:border-[#D97757]/60 hover:bg-[#EDE8DE]/40"
        }`}
      >
        {selectedFile ? (
          /* Newly selected file state */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[#E4E1D8] rounded-lg shadow-xs">
            <div className="flex items-center gap-3 truncate">
              <div className="p-2.5 bg-[#D97757]/10 rounded-lg text-[#D97757] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="text-left truncate">
                <p className="text-sm font-semibold text-[#1F1F1C] truncate">
                  {selectedFile.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#6B6A63] mt-0.5">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#6F8068] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready to upload (click "Save Profile Changes" below)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 text-[#6B6A63] hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          /* Empty / Prompt state */
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-[#EDE8DE] rounded-xl text-[#D97757]">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#1F1F1C]">
                Drag and drop your CV file here, or{" "}
                <span className="text-[#D97757] underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-[#6B6A63] mt-1">
                Supports PDF, DOC, DOCX up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Current File indicator if one is already saved */}
      {currentCvUrl && !selectedFile && (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-[#E4E1D8] rounded-lg text-xs text-[#6B6A63]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D97757]" />
            <span>
              Current CV on file:{" "}
              <strong className="text-[#1F1F1C] font-mono">
                {currentCvUrl.split("/").pop()}
              </strong>
            </span>
          </div>

          <a
            href={currentCvUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center gap-1 text-[#D97757] hover:text-[#B9573D] font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            Preview / Download
          </a>
        </div>
      )}
    </div>
  );
}
