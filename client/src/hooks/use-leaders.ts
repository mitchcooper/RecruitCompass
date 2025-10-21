import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Leader, InsertLeader } from "@shared/schema";

export function useLeaders() {
  return useQuery<Leader[]>({
    queryKey: ["/api/leaders"],
  });
}

export function useCreateLeader() {
  return useMutation({
    mutationFn: async (data: InsertLeader) => {
      return await apiRequest("POST", "/api/leaders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
    },
  });
}

export function useUpdateLeader() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertLeader> }) => {
      return await apiRequest("PATCH", `/api/leaders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
    },
  });
}

export function useDeleteLeader() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/leaders/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
    },
  });
}
