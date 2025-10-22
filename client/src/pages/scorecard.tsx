import { useState } from "react";
import { ScoreboardTable } from "@/components/scorecard/scoreboard-table";
import { ScoreboardHeader } from "@/components/scorecard/scoreboard-header";
import { startOfWeek, endOfWeek } from "date-fns";

export default function Scorecard() {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [dateTo, setDateTo] = useState<Date | undefined>(endOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <ScoreboardHeader
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      <div className="mt-8">
        <ScoreboardTable dateFrom={dateFrom} dateTo={dateTo} />
      </div>
    </div>
  );
}
