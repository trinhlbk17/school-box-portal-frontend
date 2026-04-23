import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import md5 from "crypto-js/md5";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ROLES } from "@/shared/constants/roles";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "@/features/user/schemas/userSchema";
import type { AdminUser } from "@/features/user/types/user.types";

const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.STUDENT]: "Student",
  [ROLES.PROTECTOR]: "Protector",
};

function generateRandomPassword(length = 12): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

// ── Create User Dialog ──────────────────────────────────────────────────────

interface CreateUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    email: string;
    name: string;
    role: string;
    password: string;
    plainPassword: string;
  }) => void;
  isPending: boolean;
}

export function CreateUserDialog({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}: CreateUserDialogProps) {
  const [generatedPassword, setGeneratedPassword] = useState(
    generateRandomPassword()
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      role: undefined,
      passwordMode: "auto",
      password: "",
    },
  });

  const passwordMode = watch("passwordMode");

  useEffect(() => {
    if (isOpen) {
      reset({
        email: "",
        name: "",
        role: undefined,
        passwordMode: "auto",
        password: "",
      });
      setGeneratedPassword(generateRandomPassword());
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (values: CreateUserFormValues) => {
    const plainPassword =
      values.passwordMode === "auto" ? generatedPassword : (values.password ?? "");
    const hashedPassword = md5(plainPassword).toString();
    onSubmit({
      email: values.email,
      name: values.name,
      role: values.role,
      password: hashedPassword,
      plainPassword,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-2">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="create-user-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-user-email"
              type="email"
              placeholder="user@school.edu.vn"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="create-user-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="create-user-name"
              placeholder="Nguyen Van A"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label htmlFor="create-user-role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="create-user-role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Password Mode */}
          <div className="space-y-2">
            <Label>Password</Label>
            <Controller
              name="passwordMode"
              control={control}
              render={({ field }) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => field.onChange("auto")}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      field.value === "auto"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    Auto-generate
                  </button>
                  <button
                    type="button"
                    onClick={() => field.onChange("manual")}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      field.value === "manual"
                        ? "border-primary-600 bg-primary-50 text-primary-700"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                    }`}
                  >
                    Manual input
                  </button>
                </div>
              )}
            />

            {passwordMode === "auto" ? (
              <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                <span className="flex-1 font-mono text-sm text-neutral-700">
                  {generatedPassword}
                </span>
                <button
                  type="button"
                  onClick={() => setGeneratedPassword(generateRandomPassword())}
                  className="text-neutral-400 hover:text-neutral-600"
                  aria-label="Generate new password"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Input
                  id="create-user-password"
                  type="text"
                  placeholder="Enter password (min. 6 characters)"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit User Dialog ────────────────────────────────────────────────────────

interface EditUserDialogProps {
  isOpen: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSubmit: (payload: { email: string; name: string }) => void;
  isPending: boolean;
}

export function EditUserDialog({
  isOpen,
  user,
  onClose,
  onSubmit,
  isPending,
}: EditUserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { email: "", name: "" },
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({ email: user.email, name: user.name });
    }
  }, [isOpen, user, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user's name and email. Role cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-user-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input id="edit-user-email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-user-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input id="edit-user-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
