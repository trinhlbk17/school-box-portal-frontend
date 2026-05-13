import { useQuery } from "@tanstack/react-query";
import { protectorApi } from "../api/protectorApi";

export function useMyStudents() {
  return useQuery({
    queryKey: ["protectors", "my-students"],
    queryFn: () => protectorApi.getMyStudents(),
  });
}
