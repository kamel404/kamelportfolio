import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
      <div className="p-3 bg-white border border-[#E4E1D8] rounded-2xl shadow-xs">
        <Loader2 className="w-7 h-7 text-[#D97757] animate-spin" />
      </div>
      <p className="text-xs font-medium text-[#6B6A63] tracking-wide animate-pulse">
        Loading admin data...
      </p>
    </div>
  );
}
