import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { RecruitWithRelations, InsertRecruit } from "@shared/schema";

interface RecruitFilters {
  status?: string;
  leaderId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export function useRecruits(filters?: RecruitFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.leaderId) params.append("leaderId", filters.leaderId);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
  if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());

  const queryString = params.toString();
  const url = queryString ? `/api/recruits?${queryString}` : "/api/recruits";

  return useQuery<RecruitWithRelations[]>({
    queryKey: ["/api/recruits", filters],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recruits");
      return response.json();
    },
  });
}

export function useCreateRecruit() {
  return useMutation({
    mutationFn: async (data: InsertRecruit) => {
      return await apiRequest("POST", "/api/recruits", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scorecard"] });
    },
  });
}

export function useUpdateRecruitStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/recruits/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scorecard"] });
    },
  });
}

export function useDeleteRecruit() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/recruits/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recruits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scorecard"] });
    },
  });
}
