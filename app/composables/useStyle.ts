const SEV_CLS: Record<string, string> = {
  LOW: "bg-gray-600/20 text-gray-400",
  MEDIUM: "bg-warning/20 text-warning",
  HIGH: "bg-orange-500/20 text-orange-400",
  CRITICAL: "bg-danger/20 text-danger",
};

const STAT_CLS: Record<string, string> = {
  NEW: "bg-accent/20 text-accent",
  TRIAGED: "bg-purple-500/20 text-purple-400",
  NEEDS_MORE_INFO: "bg-warning/20 text-warning",
  RESOLVED: "bg-success/20 text-success",
  INFORMATIVE: "bg-gray-500/20 text-gray-400",
  DUPLICATE: "bg-orange-500/20 text-orange-400",
  SPAM: "bg-red-500/20 text-red-400",
};

export function useStyle() {
  function sevCls(s: string) {
    return SEV_CLS[s] || SEV_CLS.LOW;
  }

  function statCls(s: string) {
    return STAT_CLS[s] || STAT_CLS.NEW;
  }

  return { sevCls, statCls };
}
