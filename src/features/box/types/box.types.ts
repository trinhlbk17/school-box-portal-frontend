export interface BoxStatus {
  isConnected: boolean;
  boxUserId?: string;
  expiresAt?: string;
}

export interface BoxAuthUrl {
  authUrl: string;
}

export type BoxItemType = "file" | "folder";

export interface BoxFolderItem {
  id: string;
  name: string;
  type: BoxItemType;
  extension?: string;
  size?: number;
  modifiedAt?: string;
}

export interface BoxFolderItemsResponse {
  items: BoxFolderItem[];
  folderId: string;
  folderName: string;
}

export interface BoxFolderBrowserResult {
  id: string;
  name: string;
  type: BoxItemType;
}

export interface BoxFolderStack {
  id: string;
  name: string;
}
