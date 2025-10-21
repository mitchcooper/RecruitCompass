import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function ScoreboardHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
        <Trophy className="w-8 h-8 text-accent" />
      </div>
      <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
        Recruitment Competition Scorecard
      </h1>
      <p className="text-lg text-muted-foreground">
        Weekly performance tracker
      </p>
    </div>
  );
}
