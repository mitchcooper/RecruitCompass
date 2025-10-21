import { useQuery } from "@tanstack/react-query";
import type { LeaderWithStats } from "@shared/schema";

export function useScorecard(weekStart?: Date) {
  const params = new URLSearchParams();
  if (weekStart) {
    params.append("weekStart", weekStart.toISOString());
  }

  const queryString = params.toString();
  const url = queryString ? `/api/scorecard?${queryString}` : "/api/scorecard";

  return useQuery<LeaderWithStats[]>({
    queryKey: ["/api/scorecard", weekStart?.toISOString()],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch scorecard");
      return response.json();
    },
  });
}
