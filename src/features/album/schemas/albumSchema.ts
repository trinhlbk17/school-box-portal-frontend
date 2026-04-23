import { z } from "zod";

export const createAlbumSchema = z.object({
  name: z.string().min(1, "Album name is required").max(100, "Album name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
});

export const updateAlbumSchema = z.object({
  name: z.string().min(1, "Album name is required").max(100, "Album name is too long").optional(),
  description: z.string().max(500, "Description is too long").optional(),
});

export type CreateAlbumFormData = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumFormData = z.infer<typeof updateAlbumSchema>;
