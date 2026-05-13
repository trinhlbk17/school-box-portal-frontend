import { z } from "zod";

export const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  address: z.string().optional(),
  phone: z.string().optional(),
  parentBoxFolderId: z.string().min(1, "Parent Box Folder is required"),
});

export type SchoolFormValues = z.infer<typeof schoolSchema>;
