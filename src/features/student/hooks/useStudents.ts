import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { studentApi } from "@/features/student/api/studentApi";
import type {
  CreateStudentInput,
  UpdateStudentInput,
  TransferStudentInput,
  StudentListParams,
} from "@/features/student/types/student.types";

export const studentKeys = {
  all: ["students"] as const,
  lists: (classId: string) => [...studentKeys.all, "list", classId] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
};

export function useStudents(classId: string, params?: StudentListParams) {
  return useQuery({
    queryKey: [...studentKeys.lists(classId), params],
    queryFn: () => studentApi.getStudents(classId, params),
    enabled: !!classId,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentApi.getStudent(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentInput) => studentApi.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("Student created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to create student");
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      studentApi.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("Student updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to update student");
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("Student deleted");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to delete student");
    },
  });
}

export function useTransferStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TransferStudentInput }) =>
      studentApi.transferStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      toast.success("Student transferred successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to transfer student");
    },
  });
}
