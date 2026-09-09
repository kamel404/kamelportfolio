"use client";

import React, { useState } from "react";
import { ImageDropzone } from "./ImageDropzone";

interface ProfilePhotoDropzoneProps {
  initialUrl?: string | null;
}

export function ProfilePhotoDropzone({ initialUrl }: ProfilePhotoDropzoneProps) {
  const [url, setUrl] = useState(initialUrl || "/images/kamel-faour.jpg");

  return (
    <ImageDropzone
      value={url}
      onChange={setUrl}
      name="profile_image_url"
      folder="profile"
      label="Profile Avatar / Photo (Drag & Drop)"
      helperText="Drop your portrait photo or avatar here (JPG, PNG, WEBP up to 10MB)"
    />
  );
}
