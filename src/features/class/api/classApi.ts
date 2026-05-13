import { apiClient } from "@/shared/lib/apiClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  Class,
  CreateClassInput,
  UpdateClassInput,
  AssignTeacherInput,
  ClassTeacher,
} from "@/features/class/types/class.types";

export const classApi = {
  getClassesBySchool: async (schoolId: string): Promise<Class[]> => {
    const response = await apiClient.get<any>(`/schools/${schoolId}/classes`);
    const data = response.data.data;
    // Handle double-wrapped response from backend
    if (data && !Array.isArray(data) && Array.isArray(data.data)) {
      return data.data;
    }
    return data;
  },

  getClass: async (id: string): Promise<Class> => {
    const response = await apiClient.get<ApiResponse<Class>>(`/classes/${id}`);
    return response.data.data;
  },

  createClass: async (schoolId: string, data: CreateClassInput): Promise<Class> => {
    const response = await apiClient.post<ApiResponse<Class>>(`/schools/${schoolId}/classes`, data);
    return response.data.data;
  },

  updateClass: async (id: string, data: UpdateClassInput): Promise<Class> => {
    const response = await apiClient.put<ApiResponse<Class>>(`/classes/${id}`, data);
    return response.data.data;
  },

  deleteClass: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },

  assignTeacher: async (classId: string, data: AssignTeacherInput): Promise<ClassTeacher> => {
    const response = await apiClient.post<ApiResponse<ClassTeacher>>(`/classes/${classId}/teachers`, data);
    return response.data.data;
  },

  removeTeacher: async (classId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/classes/${classId}/teachers/${userId}`);
  },
};
