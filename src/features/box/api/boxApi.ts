import { apiClient } from "@/shared/lib/apiClient";
import type {
  BoxStatus,
  BoxAuthUrl,
  BoxFolderItemsResponse,
  BoxItemType,
} from "@/features/box/types/box.types";

export const boxApi = {
  getStatus: async (): Promise<BoxStatus> => {
    const response = await apiClient.get<BoxStatus>("/box/status");
    return response.data;
  },

  getAuthUrl: async (): Promise<BoxAuthUrl> => {
    const response = await apiClient.get<BoxAuthUrl>("/box/auth-url");
    return response.data;
  },

  disconnect: async (): Promise<void> => {
    await apiClient.delete("/box/disconnect");
  },

  getFolderItems: async (
    folderId: string,
    itemType?: BoxItemType
  ): Promise<BoxFolderItemsResponse> => {
    const response = await apiClient.get<BoxFolderItemsResponse>(
      `/box/folders/${folderId}/items`,
      { params: itemType ? { itemType } : undefined }
    );
    return response.data;
  },
};
