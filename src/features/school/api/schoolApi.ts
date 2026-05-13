import { apiClient } from "@/shared/lib/apiClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  School,
  CreateSchoolInput,
  UpdateSchoolInput,
} from "@/features/school/types/school.types";

// Helper to handle potentially double-wrapped API responses
const unwrapData = <T>(responseData: unknown): T => {
  if (responseData && typeof responseData === "object" && "data" in responseData && "success" in responseData) {
    return (responseData as Record<string, unknown>).data as T;
  }
  return responseData as T;
};

export const schoolApi = {
  getSchools: async (): Promise<School[]> => {
    const response = await apiClient.get<ApiResponse<School[]>>("/schools");
    return unwrapData<School[]>(response.data.data);
  },

  getSchool: async (id: string): Promise<School> => {
    const response = await apiClient.get<ApiResponse<School>>(`/schools/${id}`);
    return unwrapData<School>(response.data.data);
  },

  createSchool: async (data: CreateSchoolInput): Promise<School> => {
    const response = await apiClient.post<ApiResponse<School>>("/schools", data);
    return unwrapData<School>(response.data.data);
  },

  updateSchool: async (id: string, data: UpdateSchoolInput): Promise<School> => {
    const response = await apiClient.put<ApiResponse<School>>(`/schools/${id}`, data);
    return unwrapData<School>(response.data.data);
  },

  deleteSchool: async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}`);
  },
};
