import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { protectorApi } from "@/features/protector/api/protectorApi";
import type { CreateProtectorInput } from "@/features/protector/types/protector.types";

export const protectorKeys = {
  all: ["protectors"] as const,
  byStudent: (studentId: string) =>
    [...protectorKeys.all, "student", studentId] as const,
};

export function useProtectors(studentId: string) {
  return useQuery({
    queryKey: protectorKeys.byStudent(studentId),
    queryFn: () => protectorApi.getProtectors(studentId),
    enabled: !!studentId,
  });
}

export function useCreateProtector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProtectorInput) =>
      protectorApi.createProtector(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: protectorKeys.all });
      toast.success("Protector created");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to create protector");
    },
  });
}

export function useAssignProtector(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProtectorInput) =>
      protectorApi.assignProtector(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: protectorKeys.byStudent(studentId),
      });
      toast.success("Protector assigned successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to assign protector");
    },
  });
}

export function useRemoveProtector(studentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (protectorId: string) =>
      protectorApi.removeProtector(studentId, protectorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: protectorKeys.byStudent(studentId),
      });
      toast.success("Protector removed");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to remove protector");
    },
  });
}
