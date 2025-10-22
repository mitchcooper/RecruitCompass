import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export interface CompetitionSettings {
  competitionStart: string | null;
  competitionEnd: string | null;
}

export function useSettings() {
  return useQuery<CompetitionSettings>({
    queryKey: ["/api/settings"],
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<CompetitionSettings>) => {
      return await apiRequest("PATCH", "/api/settings", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}
