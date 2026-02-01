import { z } from "zod";

export const severityInfo = {
  LOW: { label: "Low", desc: "Minor issue with limited impact", color: "text-blue-400" },
  MEDIUM: { label: "Medium", desc: "Moderate impact, not immediately exploitable", color: "text-yellow-400" },
  HIGH: { label: "High", desc: "Significant impact, potentially exploitable", color: "text-orange-400" },
  CRITICAL: { label: "Critical", desc: "Severe impact, actively exploitable", color: "text-red-400" },
} as const;

export const fileInfoSchema = z.object({
  url: z.string(),
  name: z.string(),
  size: z.number(),
});

export type FileInfo = z.infer<typeof fileInfoSchema>;

export const reportFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  affectedAsset: z.string().optional(),
  assetUrl: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters").max(10000),
  impact: z.string().optional(),
  programId: z.string().optional(),
  isUnlisted: z.boolean().optional(),
  targetName: z.string().optional(),
  targetUrl: z.string().optional(),
  attachments: z.array(fileInfoSchema).optional(),
});

export type ReportFormData = z.infer<typeof reportFormSchema>;

export function useReportForm(programId?: string | null, isUnlisted = false) {
  const { busy, err, run } = useApi();

  const form = reactive<ReportFormData>({
    title: "",
    severity: "",
    affectedAsset: "",
    assetUrl: "",
    description: "",
    impact: "",
    programId: programId || "",
    isUnlisted,
    targetName: "",
    targetUrl: "",
    attachments: [],
  });

  const errors = ref<Record<string, string>>({});

  function validate(): boolean {
    errors.value = {};
    const result = reportFormSchema.safeParse(form);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        errors.value[field] = issue.message;
      }
      return false;
    }
    return true;
  }

  async function submit(): Promise<{ id: string } | null> {
    if (!validate()) return null;

    const res = await run(() =>
      $fetch("/api/reports", {
        method: "POST",
        body: form,
      }),
    );

    return res as { id: string } | null;
  }

  return {
    form,
    errors,
    busy,
    err,
    validate,
    submit,
  };
}
