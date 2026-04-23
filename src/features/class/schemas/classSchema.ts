import { z } from "zod";

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  grade: z.string().optional(),
  academicYear: z.string().optional(),
});

export type ClassFormValues = z.infer<typeof classSchema>;
