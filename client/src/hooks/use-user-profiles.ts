import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
  modules: string[];
  created_at: string;
  updated_at: string;
}

export function useUserProfiles() {
  return useQuery<UserProfile[]>({
    queryKey: ["/api/user-profiles"],
  });
}

export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserProfile> }) => {
      return await apiRequest("PATCH", `/api/user-profiles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
    },
  });
}

export function useAddModuleToUser() {
  return useMutation({
    mutationFn: async ({ userId, module }: { userId: string; module: string }) => {
      return await apiRequest("POST", `/api/user-profiles/${userId}/modules`, { module });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
    },
  });
}

export function useRemoveModuleFromUser() {
  return useMutation({
    mutationFn: async ({ userId, module }: { userId: string; module: string }) => {
      return await apiRequest("DELETE", `/api/user-profiles/${userId}/modules`, { module });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
    },
  });
}
