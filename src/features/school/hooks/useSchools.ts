import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { schoolApi } from "@/features/school/api/schoolApi";
import type {
  CreateSchoolInput,
  UpdateSchoolInput,
} from "@/features/school/types/school.types";

export const schoolKeys = {
  all: ["schools"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  details: () => [...schoolKeys.all, "detail"] as const,
  detail: (id: string) => [...schoolKeys.details(), id] as const,
};

export function useSchools() {
  return useQuery({
    queryKey: schoolKeys.lists(),
    queryFn: schoolApi.getSchools,
  });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: schoolKeys.detail(id),
    queryFn: () => schoolApi.getSchool(id),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSchoolInput) => schoolApi.createSchool(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.all });
      toast.success("School created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to create school");
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchoolInput }) =>
      schoolApi.updateSchool(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.all });
      toast.success("School updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to update school");
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schoolApi.deleteSchool(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: schoolKeys.all });
      toast.success("School deleted");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to delete school");
    },
  });
}
