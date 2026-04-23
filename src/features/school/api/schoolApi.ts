import { apiClient } from "@/shared/lib/apiClient";
import type {
  School,
  CreateSchoolInput,
  UpdateSchoolInput,
} from "@/features/school/types/school.types";

export const schoolApi = {
  getSchools: async (): Promise<School[]> => {
    const response = await apiClient.get<School[]>("/schools");
    return response.data;
  },

  getSchool: async (id: string): Promise<School> => {
    const response = await apiClient.get<School>(`/schools/${id}`);
    return response.data;
  },

  createSchool: async (data: CreateSchoolInput): Promise<School> => {
    const response = await apiClient.post<School>("/schools", data);
    return response.data;
  },

  updateSchool: async (id: string, data: UpdateSchoolInput): Promise<School> => {
    const response = await apiClient.put<School>(`/schools/${id}`, data);
    return response.data;
  },

  deleteSchool: async (id: string): Promise<void> => {
    await apiClient.delete(`/schools/${id}`);
  },
};
