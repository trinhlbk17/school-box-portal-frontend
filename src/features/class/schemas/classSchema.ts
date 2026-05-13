import { z } from "zod";

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  grade: z.string().nullable().optional(),
  academicYear: z.string().nullable().optional(),
});

export type ClassFormValues = z.infer<typeof classSchema>;
