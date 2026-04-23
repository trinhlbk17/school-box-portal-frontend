import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "@/features/user/api/userApi";
import { userKeys } from "@/features/user/hooks/useUsers";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/features/user/types/user.types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserInput) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to create user");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to update user");
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deactivated");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to deactivate user");
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User activated");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to activate user");
    },
  });
}

export function useRegeneratePassword() {
  return useMutation({
    mutationFn: (id: string) => userApi.regeneratePassword(id),
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to regenerate password");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to delete user");
    },
  });
}
