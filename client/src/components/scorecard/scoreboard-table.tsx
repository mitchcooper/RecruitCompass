import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Crown, Loader2 } from "lucide-react";
import type { LeaderWithStats } from "@shared/schema";
import { useScorecard } from "@/hooks/use-scorecard";
import { startOfWeek } from "date-fns";

export function ScoreboardTable() {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const { data: leaderStats = [], isLoading } = useScorecard(weekStart);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  return (
    <Card className="border-2">
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : leaderStats.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No scorecard data available yet
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold text-base">
                    Rank
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base">
                    Leader
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right">
                    Total Points
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right">
                    This Week
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-center">
                    Change
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right">
                    Recruits
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderStats.map((leader, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;
                  const change = leader.weeklyPoints;

                  return (
                    <TableRow
                      key={leader.id}
                      className={isTop3 ? "border-l-4 border-l-accent bg-accent/5" : ""}
                      data-testid={`row-scorecard-${leader.id}`}
                    >
                      <TableCell className="font-semibold text-lg">
                        <div className="flex items-center gap-2">
                          {rank === 1 && <Crown className="w-5 h-5 text-amber-500" />}
                          {rank}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-base">
                        {leader.name}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-foreground">
                        {leader.totalPoints}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-base">
                        {leader.weeklyPoints > 0 ? `+${leader.weeklyPoints}` : leader.weeklyPoints}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`flex items-center justify-center gap-1 ${getChangeColor(change)}`}>
                          {getChangeIcon(change)}
                          {change !== 0 && (
                            <span className="font-semibold text-sm">
                              {Math.abs(change)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {leader.recruitsCount}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
