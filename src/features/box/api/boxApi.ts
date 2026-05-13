import { apiClient } from "@/shared/lib/apiClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type {
  BoxStatus,
  BoxAuthUrl,
  BoxFolderItemsResponse,
  BoxItemType,
} from "@/features/box/types/box.types";

export const boxApi = {
  getStatus: async (): Promise<BoxStatus> => {
    const response = await apiClient.get<ApiResponse<BoxStatus>>("/box/status");
    return response.data.data;
  },

  getAuthUrl: async (): Promise<BoxAuthUrl> => {
    const response = await apiClient.get<ApiResponse<BoxAuthUrl>>("/box/auth-url");
    return response.data.data;
  },

  disconnect: async (): Promise<void> => {
    await apiClient.delete("/box/disconnect");
  },

  getFolderItems: async (
    folderId: string,
    itemType?: BoxItemType
  ): Promise<BoxFolderItemsResponse> => {
    const response = await apiClient.get<ApiResponse<BoxFolderItemsResponse>>(
      `/box/folders/${folderId}/items`,
      { params: itemType ? { itemType } : undefined }
    );
    return response.data.data;
  },
};
