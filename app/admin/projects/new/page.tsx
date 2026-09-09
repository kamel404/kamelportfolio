import React from "react";
import { getProfile } from "@/lib/data/profile";
import { NewProjectForm } from "@/components/admin/NewProjectForm";

export default async function NewProjectPage() {
  const profile = await getProfile();

  return <NewProjectForm currentCvUrl={profile.cv_url} />;
}
