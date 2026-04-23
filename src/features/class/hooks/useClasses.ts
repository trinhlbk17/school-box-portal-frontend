import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { classApi } from "@/features/class/api/classApi";
import type {
  CreateClassInput,
  UpdateClassInput,
  AssignTeacherInput,
} from "@/features/class/types/class.types";

export const classKeys = {
  all: ["classes"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (schoolId: string) => [...classKeys.lists(), schoolId] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
};

export function useClassesBySchool(schoolId: string) {
  return useQuery({
    queryKey: classKeys.list(schoolId),
    queryFn: () => classApi.getClassesBySchool(schoolId),
    enabled: !!schoolId,
  });
}

export function useClass(id: string) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => classApi.getClass(id),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schoolId, data }: { schoolId: string; data: CreateClassInput }) =>
      classApi.createClass(schoolId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success("Class created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to create class");
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassInput }) =>
      classApi.updateClass(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classKeys.detail(id) });
      toast.success("Class updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to update class");
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classApi.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      toast.success("Class deleted");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to delete class");
    },
  });
}

export function useAssignTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: AssignTeacherInput }) =>
      classApi.assignTeacher(classId, data),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.detail(classId) });
      toast.success("Teacher assigned successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to assign teacher");
    },
  });
}

export function useRemoveTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ classId, userId }: { classId: string; userId: string }) =>
      classApi.removeTeacher(classId, userId),
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({ queryKey: classKeys.detail(classId) });
      toast.success("Teacher removed");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to remove teacher");
    },
  });
}
