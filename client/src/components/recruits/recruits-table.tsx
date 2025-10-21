import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useRecruits, useUpdateRecruitStatus } from "@/hooks/use-recruits";
import { useToast } from "@/hooks/use-toast";

interface RecruitsTableProps {
  statusFilter: string;
  leaderFilter: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
}

export function RecruitsTable({
  statusFilter,
  leaderFilter,
  dateRange,
}: RecruitsTableProps) {
  const { toast } = useToast();
  const { data: recruits = [], isLoading } = useRecruits({
    status: statusFilter,
    leaderId: leaderFilter,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
  });

  const updateStatus = useUpdateRecruitStatus();

  const handleConfirm = async (recruitId: string) => {
    try {
      await updateStatus.mutateAsync({ id: recruitId, status: "Confirmed" });
      toast({ title: "Recruit confirmed successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm recruit",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (recruitId: string) => {
    if (!confirm("Are you sure you want to reject this recruit?")) return;
    try {
      await updateStatus.mutateAsync({ id: recruitId, status: "Submitted" });
      toast({ title: "Recruit status updated" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update recruit",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : recruits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No recruits found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruits.map((recruit) => (
                  <TableRow key={recruit.id} data-testid={`row-recruit-${recruit.id}`}>
                    <TableCell className="font-medium">{recruit.name}</TableCell>
                    <TableCell className="text-muted-foreground">{recruit.leader.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{recruit.type.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(recruit.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{recruit.mobile}</TableCell>
                    <TableCell className="text-muted-foreground">{recruit.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={recruit.status === "Confirmed" ? "default" : "secondary"}
                        className={
                          recruit.status === "Confirmed"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-amber-500 hover:bg-amber-600 text-white"
                        }
                      >
                        {recruit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {recruit.status === "Submitted" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-green-50 hover:text-green-600"
                            onClick={() => handleConfirm(recruit.id)}
                            disabled={updateStatus.isPending}
                            data-testid={`button-confirm-recruit-${recruit.id}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleReject(recruit.id)}
                            disabled={updateStatus.isPending}
                            data-testid={`button-reject-recruit-${recruit.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
