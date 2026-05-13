import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1, "VITE_API_BASE_URL must not be empty"),
  VITE_APP_NAME: z.string().min(1, "VITE_APP_NAME must not be empty"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  const formatted = parsed.error.format();
  console.error("❌ Invalid environment variables:", JSON.stringify(formatted, null, 2));
  throw new Error("Invalid environment variables. Check the console for details.");
}

export const env = parsed.data;
