import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { boxApi } from "@/features/box/api/boxApi";
import { boxKeys } from "@/features/box/hooks/useBoxStatus";

export function useBoxConnect() {
  const connect = async () => {
    const { authUrl } = await boxApi.getAuthUrl();
    window.location.href = authUrl;
  };

  return { connect };
}

export function useBoxDisconnect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => boxApi.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boxKeys.status() });
      toast.success("Disconnected from Box");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message ?? "Failed to disconnect from Box");
    },
  });
}
