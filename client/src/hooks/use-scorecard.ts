import { useQuery } from "@tanstack/react-query";
import type { LeaderWithStats } from "@shared/schema";

export function useScorecard(dateFrom?: Date, dateTo?: Date) {
  const params = new URLSearchParams();
  if (dateFrom) {
    params.append("dateFrom", dateFrom.toISOString());
  }
  if (dateTo) {
    params.append("dateTo", dateTo.toISOString());
  }

  const queryString = params.toString();
  const url = queryString ? `/api/scorecard?${queryString}` : "/api/scorecard";

  return useQuery<LeaderWithStats[]>({
    queryKey: [url],
  });
}
