import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { RecruiterType, InsertType } from "@shared/schema";

export function useTypes() {
  return useQuery<RecruiterType[]>({
    queryKey: ["/api/types"],
  });
}

export function useCreateType() {
  return useMutation({
    mutationFn: async (data: InsertType) => {
      return await apiRequest("POST", "/api/types", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/points"] });
    },
  });
}

export function useUpdateType() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertType> }) => {
      return await apiRequest("PATCH", `/api/types/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
    },
  });
}

export function useDeleteType() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/types/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/types"] });
      queryClient.invalidateQueries({ queryKey: ["/api/points"] });
    },
  });
}
