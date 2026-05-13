import { apiClient } from "@/shared/lib/apiClient";
import type {
  AdminUser,
  AdminUserDetail,
  CreateUserInput,
  UpdateUserInput,
  UserQueryParams,
  RegeneratePasswordResponse,
} from "@/features/user/types/user.types";
import type { PaginatedResponse, ApiResponse } from "@/shared/types/api.types";

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
    const response = await apiClient.get<ApiResponse<AdminUserDetail>>(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (data: CreateUserInput): Promise<AdminUser> => {
    const response = await apiClient.post<ApiResponse<AdminUser>>("/users", data);
    return response.data.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserInput
  ): Promise<AdminUser> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, data);
    return response.data.data;
  },

  deactivateUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(
      `/users/${id}/deactivate`
    );
    return response.data.data;
  },

  activateUser: async (id: string): Promise<AdminUser> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}/activate`);
    return response.data.data;
  },

  regeneratePassword: async (
    id: string
  ): Promise<RegeneratePasswordResponse> => {
    const response = await apiClient.post<ApiResponse<RegeneratePasswordResponse>>(
      `/users/${id}/regenerate-password`
    );
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
