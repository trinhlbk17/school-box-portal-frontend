import { apiClient } from "@/shared/lib/apiClient";
import type {
  Protector,
  CreateProtectorInput,
} from "@/features/protector/types/protector.types";

export const protectorApi = {
  getProtectors: async (studentId: string): Promise<Protector[]> => {
    const response = await apiClient.get<Protector[]>(
      `/students/${studentId}/protectors`
    );
    return response.data;
  },

  createProtector: async (data: CreateProtectorInput): Promise<Protector> => {
    const response = await apiClient.post<Protector>("/protectors", data);
    return response.data;
  },

  assignProtector: async (
    studentId: string,
    data: CreateProtectorInput
  ): Promise<Protector> => {
    const response = await apiClient.post<Protector>(
      `/students/${studentId}/protectors`,
      data
    );
    return response.data;
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
