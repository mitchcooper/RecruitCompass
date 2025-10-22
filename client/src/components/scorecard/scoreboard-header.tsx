import { Trophy, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

interface ScoreboardHeaderProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateFromChange: (date: Date | undefined) => void;
  onDateToChange: (date: Date | undefined) => void;
}

export function ScoreboardHeader({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: ScoreboardHeaderProps) {
  const { data: settings } = useSettings();

  const competitionPeriodText = settings?.competitionStart && settings?.competitionEnd
    ? `Competition Period: ${format(new Date(settings.competitionStart), "MMM d, yyyy")} - ${format(new Date(settings.competitionEnd), "MMM d, yyyy")}`
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
          Recruitment Competition Scorecard
        </h1>
        {competitionPeriodText && (
          <p className="text-base text-muted-foreground mb-1">
            {competitionPeriodText}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">Filter Period:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal border-border/60 shadow-sm hover:shadow-md transition-shadow",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={onDateFromChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-sm text-muted-foreground">to</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal border-border/60 shadow-sm hover:shadow-md transition-shadow",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM d, yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={onDateToChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
