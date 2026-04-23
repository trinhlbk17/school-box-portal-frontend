import { useQuery } from "@tanstack/react-query";
import { boxApi } from "@/features/box/api/boxApi";

export const boxKeys = {
  all: ["box"] as const,
  status: () => [...boxKeys.all, "status"] as const,
};

export function useBoxStatus() {
  return useQuery({
    queryKey: boxKeys.status(),
    queryFn: () => boxApi.getStatus(),
    staleTime: 30_000, // 30 seconds — status doesn't change often
  });
}
