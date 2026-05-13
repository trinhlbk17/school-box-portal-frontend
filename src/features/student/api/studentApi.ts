import { apiClient } from "@/shared/lib/apiClient";
import type {
  Student,
  CreateStudentInput,
  UpdateStudentInput,
  TransferStudentInput,
  StudentListParams,
} from "@/features/student/types/student.types";
import type { PaginatedResponse, ApiResponse } from "@/shared/types/api.types";

export const studentApi = {
  getStudents: async (
    classId: string,
    params?: StudentListParams
  ): Promise<PaginatedResponse<Student>> => {
    const response = await apiClient.get<PaginatedResponse<Student>>(
      `/classes/${classId}/students`,
      { params }
    );
    return response.data;
  },

  getStudent: async (id: string): Promise<Student> => {
    const response = await apiClient.get<ApiResponse<Student>>(`/students/${id}`);
    return response.data.data;
  },

  createStudent: async (data: CreateStudentInput): Promise<Student> => {
    const response = await apiClient.post<ApiResponse<Student>>("/students", data);
    return response.data.data;
  },

  updateStudent: async (
    id: string,
    data: UpdateStudentInput
  ): Promise<Student> => {
    const response = await apiClient.put<ApiResponse<Student>>(`/students/${id}`, data);
    return response.data.data;
  },

  deleteStudent: async (id: string): Promise<void> => {
    await apiClient.delete(`/students/${id}`);
  },

  transferStudent: async (
    id: string,
    data: TransferStudentInput
  ): Promise<Student> => {
    const response = await apiClient.post<ApiResponse<Student>>(
      `/students/${id}/transfer`,
      data
    );
    return response.data.data;
  },
};
