import { apiClient } from "@/shared/lib/apiClient";
import type {
  AdminUser,
  AdminUserDetail,
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
  RegeneratePasswordResponse,
} from "@/features/user/types/user.types";
import type { PaginatedResponse } from "@/shared/types/api.types";

export const userApi = {
  getUsers: async (
    params?: UserQueryParams
  ): Promise<PaginatedResponse<AdminUser>> => {
    const response = await apiClient.get<PaginatedResponse<AdminUser>>(
      "/users",
      { params }
    );
    return response.data;
  },

  getUser: async (id: string): Promise<AdminUserDetail> => {
    const response = await apiClient.get<AdminUserDetail>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserInput): Promise<AdminUser> => {
    const response = await apiClient.post<AdminUser>("/users", data);
    return response.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserInput
  ): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/users/${id}`, data);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(
      `/users/${id}/deactivate`
    );
    return response.data;
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.patch<AdminUser>(`/users/${id}/activate`);
    return response.data;
  },

  regeneratePassword: async (
    id: string
  ): Promise<RegeneratePasswordResponse> => {
    const response = await apiClient.post<RegeneratePasswordResponse>(
      `/users/${id}/regenerate-password`
    );
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
