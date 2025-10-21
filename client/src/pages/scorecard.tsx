import { ScoreboardTable } from "@/components/scorecard/scoreboard-table";
import { ScoreboardHeader } from "@/components/scorecard/scoreboard-header";

export default function Scorecard() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <ScoreboardHeader />
      <div className="mt-8">
        <ScoreboardTable />
      </div>
    </div>
  );
}
