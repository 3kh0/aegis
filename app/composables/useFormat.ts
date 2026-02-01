const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  TRIAGED: "Triaged",
  NEEDS_MORE_INFO: "Needs More Info",
  RESOLVED: "Resolved",
  INFORMATIVE: "Informative",
  DUPLICATE: "Duplicate",
  SPAM: "Spam",
};

export function useFormat() {
  function ago(d: string | Date) {
    const now = new Date();
    const then = new Date(d);
    const ms = now.getTime() - then.getTime();
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(ms / 3600000);
    const days = Math.floor(ms / 86400000);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    return date(d);
  }

  function date(d: string | Date) {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function statLabel(s: string) {
    return STATUS_LABELS[s] || s;
  }

  return { ago, date, statLabel };
}
