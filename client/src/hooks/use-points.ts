import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TypeWithPoints, InsertPoints } from "@shared/schema";

export function useTypesWithPoints() {
  return useQuery<TypeWithPoints[]>({
    queryKey: ["/api/points"],
  });
}

export function useUpsertPoints() {
  return useMutation({
    mutationFn: async (data: InsertPoints) => {
      return await apiRequest("POST", "/api/points", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/points"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scorecard"] });
    },
  });
}
