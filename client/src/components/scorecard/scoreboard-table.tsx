import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Crown, Loader2 } from "lucide-react";
import type { LeaderWithStats } from "@shared/schema";
import { useScorecard } from "@/hooks/use-scorecard";

interface ScoreboardTableProps {
  dateFrom?: Date;
  dateTo?: Date;
}

export function ScoreboardTable({ dateFrom, dateTo }: ScoreboardTableProps) {
  const { data: leaderStats = [], isLoading } = useScorecard(dateFrom, dateTo);

  const getRankChangeDisplay = (rankChange: number) => {
    if (rankChange > 0) {
      return (
        <div className="flex items-center justify-center gap-1 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold text-sm">{rankChange}</span>
        </div>
      );
    }
    if (rankChange < 0) {
      return (
        <div className="flex items-center justify-center gap-1 text-red-600">
          <TrendingDown className="w-4 h-4" />
          <span className="font-semibold text-sm">{Math.abs(rankChange)}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center text-muted-foreground">
        <Minus className="w-4 h-4" />
      </div>
    );
  };

  return (
    <Card className="border border-gray-200 shadow-lg rounded-lg">
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
            <Table className="border-0">
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary border-b border-primary/30">
                  <TableHead className="text-primary-foreground font-semibold text-base py-4 px-6">
                    Rank
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base py-4 px-6">
                    Leader
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    Papers
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    New Starter
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    Established
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    Total
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    This Week
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-center py-4 px-6">
                    Rank Change
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base text-right py-4 px-6">
                    Recruits
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderStats.map((leader, index) => {
                  const rank = index + 1;
                  const isTop3 = rank <= 3;

                  return (
                    <TableRow
                      key={leader.id}
                      className={`
                        ${isTop3 ? "bg-accent/5" : ""}
                        ${index % 2 === 1 ? "bg-muted/30" : "bg-background"}
                        border-b border-border/50
                        hover:bg-muted/50
                      `}
                      data-testid={`row-scorecard-${leader.id}`}
                    >
                      <TableCell className="font-semibold text-lg py-6 px-6">
                        <div className="flex items-center gap-2">
                          {rank === 1 && <Crown className="w-5 h-5 text-amber-500" />}
                          {rank}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-base py-6 px-6">
                        {leader.name}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base py-6 px-6">
                        {leader.paperPoints}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base py-6 px-6">
                        {leader.newStarterPoints}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base py-6 px-6">
                        {leader.establishedPoints}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg text-foreground py-6 px-6">
                        {leader.totalPoints}
                      </TableCell>
                      <TableCell className="text-right font-medium text-base py-6 px-6">
                        {leader.thisWeekPoints > 0 ? (
                          <span className="text-green-600 font-semibold">+{leader.thisWeekPoints}</span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-6 px-6">
                        {getRankChangeDisplay(leader.rankChange)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground py-6 px-6">
                        <div className="flex items-center justify-end gap-1">
                          <span>{leader.recruitsCount}</span>
                          {leader.periodRecruits > 0 && (
                            <span className="text-green-600 font-semibold text-sm">
                              (+{leader.periodRecruits})
                            </span>
                          )}
                        </div>
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
