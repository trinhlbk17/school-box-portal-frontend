import { z } from "zod";
import { ROLES } from "@/shared/constants/roles";

export const createUserSchema = z
  .object({
    email: z.string().email("Please enter a valid email"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.enum(
      [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PROTECTOR],
      { required_error: "Please select a role" }
    ),
    passwordMode: z.enum(["auto", "manual"]),
    password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.passwordMode === "manual") {
        return (data.password ?? "").length >= 6;
      }
      return true;
    },
    {
      message: "Password must be at least 6 characters",
      path: ["password"],
    }
  );

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
