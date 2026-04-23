import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import type { LoginFormValues } from "@/features/auth/schemas/loginSchema";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ROLE_REDIRECT } from "@/shared/constants/roles";

export function LoginPage() {
  const { user, sessionToken } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect already-authenticated users
  useEffect(() => {
    if (user && sessionToken) {
      navigate(ROLE_REDIRECT[user.role], { replace: true });
    }
  }, [user, sessionToken, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
          {/* Brand header */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">School Box Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* API error banner */}
          {error && (
            <div
              role="alert"
              className="bg-error-50 border border-error-200 text-error-700 rounded-lg px-4 py-3 text-sm"
            >
              {error.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-lg border bg-background text-foreground",
                  "placeholder:text-muted-foreground text-sm transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                  errors.email
                    ? "border-error-400 focus:ring-error-500"
                    : "border-input hover:border-primary-400",
                )}
                placeholder="you@school.edu"
              />
              {errors.email && (
                <p className="text-xs text-error-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password")}
                  className={cn(
                    "w-full px-3.5 py-2.5 pr-10 rounded-lg border bg-background text-foreground",
                    "placeholder:text-muted-foreground text-sm transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                    errors.password
                      ? "border-error-400 focus:ring-error-500"
                      : "border-input hover:border-primary-400",
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error-600">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="login-remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 rounded border-input accent-primary-600 cursor-pointer"
              />
              <label
                htmlFor="login-remember-me"
                className="text-sm text-foreground cursor-pointer select-none"
              >
                Keep me logged in
              </label>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                "bg-primary-600 hover:bg-primary-700 active:bg-primary-800",
                "text-white text-sm font-semibold transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
