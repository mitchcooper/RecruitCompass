import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecruitsTable } from "@/components/recruits/recruits-table";
import { AddRecruitDialog } from "@/components/recruits/add-recruit-dialog";
import { RecruitsFilters } from "@/components/recruits/recruits-filters";

export default function Recruits() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [leaderFilter, setLeaderFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            Recruits Management
          </h1>
          <p className="text-muted-foreground">
            Add, review, and confirm recruit submissions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-recruit">
          <Plus className="h-4 w-4 mr-2" />
          Add Recruit
        </Button>
      </div>

      <RecruitsFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        leaderFilter={leaderFilter}
        setLeaderFilter={setLeaderFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      <RecruitsTable
        statusFilter={statusFilter}
        leaderFilter={leaderFilter}
        dateRange={dateRange}
      />

      <AddRecruitDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
