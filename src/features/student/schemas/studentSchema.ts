import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
