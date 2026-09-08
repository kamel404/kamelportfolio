import React from "react";
import { getSkills } from "@/lib/data/skills";
import { saveSkill, deleteSkill } from "../actions";
import { Tag } from "@/components/ui/Tag";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1C]">
          Skills Management
        </h1>
        <p className="text-sm text-[#6B6A63] mt-1">
          Add and manage your technical skills and tooling.
        </p>
      </div>

      {/* Add Skill Form */}
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-base font-semibold text-[#1F1F1C] mb-4">
          Add New Skill
        </h2>
        <form action={saveSkill} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Skill Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Next.js, Flutter"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Category *
              </label>
              <select
                name="category"
                defaultValue="Frontend"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="Databases">Databases</option>
                <option value="Tools & Cloud">Tools & Cloud</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1F1C] mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                name="sort_order"
                defaultValue={1}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E4E1D8] bg-white text-[#1F1F1C] text-sm focus:outline-none focus:ring-2 focus:ring-[#D97757]/40"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <SubmitButton loadingText="Adding Skill...">
              Add Skill
            </SubmitButton>
          </div>
        </form>
      </div>

      {/* Existing Skills */}
      <div className="bg-white border border-[#E4E1D8] rounded-xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-[#1F1F1C]">
          Configured Skills ({skills.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#E4E1D8] bg-[#F7F6F2]"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-[#1F1F1C]">
                  {skill.name}
                </span>
                <Tag variant="muted">{skill.category}</Tag>
              </div>

              <form
                action={async () => {
                  "use server";
                  await deleteSkill(skill.id);
                }}
              >
                <DeleteButton title="Delete Skill" />
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
