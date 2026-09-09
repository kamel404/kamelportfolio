/**
 * Normalizes user-entered date strings (e.g. "2024", "Jan 2024", "2024-05")
 * into PostgreSQL compatible DATE strings (YYYY-MM-DD).
 */
export function normalizeDateForDb(dateStr: string | null | undefined): string | null {
  if (!dateStr || !dateStr.trim()) return null;
  const s = dateStr.trim();

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // If YYYY-MM
  if (/^\d{4}-\d{2}$/.test(s)) return `${s}-01`;

  // If pure year YYYY (e.g. 2024)
  if (/^\d{4}$/.test(s)) return `${s}-01-01`;

  // If "Month Year" (e.g. "Jan 2024" or "January 2024")
  const months: Record<string, string> = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12",
  };

  const monthYearMatch = s.match(/^([a-zA-Z]+)[.\s]+(\d{4})$/);
  if (monthYearMatch) {
    const m = monthYearMatch[1].slice(0, 3).toLowerCase();
    const y = monthYearMatch[2];
    const monthNum = months[m] || "01";
    return `${y}-${monthNum}-01`;
  }

  // Fallback: try JS Date parsing
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return `${new Date().getFullYear()}-01-01`;
}

/**
 * Formats database DATE strings (YYYY-MM-DD) into user-friendly strings (e.g. "2024" or "Jan 2024")
 */
export function formatDateForDisplay(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const s = dateStr.trim();

  const match = s.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (match) {
    const year = match[1];
    const month = match[2];
    const day = match[3];

    // If it was stored as YYYY-01-01, display as just YYYY
    if (month === "01" && (day === "01" || !day)) {
      return year;
    }

    if (month) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${monthNames[mIdx] || month} ${year}`;
    }

    return year;
  }

  return s;
}
