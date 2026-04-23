import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/apiClient";

interface TeacherUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UsersResponse {
  data: TeacherUser[];
  total: number;
}

const teacherUserKeys = {
  all: ["users", "teachers"] as const,
};

export function useTeacherUsers() {
  return useQuery({
    queryKey: teacherUserKeys.all,
    queryFn: async (): Promise<TeacherUser[]> => {
      const response = await apiClient.get<UsersResponse | TeacherUser[]>("/users", {
        params: { role: "TEACHER", limit: 100 },
      });
      // Handle both array and paginated response shapes
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return (response.data as UsersResponse).data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — teacher list doesn't change often
  });
}
