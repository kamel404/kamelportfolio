import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Wrench,
  User,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no user (e.g. on /admin/login), render children directly without sidebar
  if (!user) {
    return <>{children}</>;
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Projects", href: "/admin/projects", icon: <FolderGit2 className="w-4 h-4" /> },
    { label: "Experience", href: "/admin/experience", icon: <Briefcase className="w-4 h-4" /> },
    { label: "Skills", href: "/admin/skills", icon: <Wrench className="w-4 h-4" /> },
    { label: "Profile", href: "/admin/profile", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#E4E1D8] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E4E1D8]">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-base text-[#1F1F1C]">Admin Panel</span>
              <p className="text-xs text-[#6B6A63] truncate">{user.email}</p>
            </div>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 rounded-md hover:bg-[#EDE8DE] text-[#6B6A63] hover:text-[#1F1F1C] transition-colors"
              title="View Public Site"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 flex-1 flex flex-row md:flex-col gap-1 overflow-x-auto">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B6A63] hover:text-[#1F1F1C] hover:bg-[#EDE8DE]/60 transition-colors whitespace-nowrap"
            >
              <span className="text-[#D97757]">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-[#E4E1D8]">
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-5xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
