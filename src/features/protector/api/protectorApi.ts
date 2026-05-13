import { apiClient } from "@/shared/lib/apiClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  Protector,
  CreateProtectorInput,
} from "@/features/protector/types/protector.types";
import type { Student } from "@/features/student/types/student.types";

export const protectorApi = {
  getMyStudents: async (): Promise<Student[]> => {
    const response = await apiClient.get<ApiResponse<Student[]>>("/protectors/my-students");
    return response.data.data;
  },

  getProtectors: async (studentId: string): Promise<Protector[]> => {
    const response = await apiClient.get<ApiResponse<Protector[]>>(
      `/students/${studentId}/protectors`
    );
    return response.data.data;
  },

  createProtector: async (data: CreateProtectorInput): Promise<Protector> => {
    const response = await apiClient.post<ApiResponse<Protector>>("/protectors", data);
    return response.data.data;
  },

  assignProtector: async (
    studentId: string,
    data: CreateProtectorInput
  ): Promise<Protector> => {
    const response = await apiClient.post<ApiResponse<Protector>>(
      `/students/${studentId}/protectors`,
      data
    );
    return response.data.data;
  },

  removeProtector: async (
    studentId: string,
    protectorId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/students/${studentId}/protectors/${protectorId}`
    );
  },
};
