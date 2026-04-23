import { apiClient } from "@/shared/lib/apiClient";
import type {
  Class,
  CreateClassInput,
  UpdateClassInput,
  AssignTeacherInput,
  ClassTeacher,
} from "@/features/class/types/class.types";

export const classApi = {
  getClassesBySchool: async (schoolId: string): Promise<Class[]> => {
    const response = await apiClient.get<Class[]>(`/schools/${schoolId}/classes`);
    return response.data;
  },

  getClass: async (id: string): Promise<Class> => {
    const response = await apiClient.get<Class>(`/classes/${id}`);
    return response.data;
  },

  createClass: async (schoolId: string, data: CreateClassInput): Promise<Class> => {
    const response = await apiClient.post<Class>(`/schools/${schoolId}/classes`, data);
    return response.data;
  },

  updateClass: async (id: string, data: UpdateClassInput): Promise<Class> => {
    const response = await apiClient.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  deleteClass: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },

  assignTeacher: async (classId: string, data: AssignTeacherInput): Promise<ClassTeacher> => {
    const response = await apiClient.post<ClassTeacher>(`/classes/${classId}/teachers`, data);
    return response.data;
  },

  removeTeacher: async (classId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/classes/${classId}/teachers/${userId}`);
  },
};
