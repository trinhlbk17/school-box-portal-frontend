import { useQuery } from "@tanstack/react-query";
import { boxApi } from "@/features/box/api/boxApi";
import type { BoxItemType } from "@/features/box/types/box.types";

export const boxFolderKeys = {
  all: ["boxFolder"] as const,
  items: (folderId: string, itemType?: BoxItemType) =>
    [...boxFolderKeys.all, folderId, itemType] as const,
};

export function useBoxFolderItems(folderId: string, itemType?: BoxItemType) {
  return useQuery({
    queryKey: boxFolderKeys.items(folderId, itemType),
    queryFn: () => boxApi.getFolderItems(folderId, itemType),
    enabled: !!folderId,
    staleTime: 60_000, // 1 min — folder contents don't change frequently
  });
}
