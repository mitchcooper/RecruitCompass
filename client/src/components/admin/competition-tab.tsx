import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

export function CompetitionTab() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Initialize state when settings load
  const currentStart = settings?.competitionStart
    ? new Date(settings.competitionStart)
    : undefined;
  const currentEnd = settings?.competitionEnd
    ? new Date(settings.competitionEnd)
    : undefined;

  const handleSave = async () => {
    if (!startDate && !endDate) {
      toast({
        title: "No changes",
        description: "Please select dates to update",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateSettings.mutateAsync({
        competitionStart: startDate?.toISOString() || settings?.competitionStart || undefined,
        competitionEnd: endDate?.toISOString() || settings?.competitionEnd || undefined,
      });

      toast({
        title: "Success",
        description: "Competition period updated successfully",
      });

      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update competition period",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition Period Configuration</CardTitle>
        <CardDescription>
          Set the active competition period dates. This will be displayed on the scorecard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Current Start Date
            </label>
            <div className="p-3 border rounded-md bg-muted/50">
              {currentStart ? format(currentStart, "MMMM d, yyyy") : "Not set"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Current End Date
            </label>
            <div className="p-3 border rounded-md bg-muted/50">
              {currentEnd ? format(currentEnd, "MMMM d, yyyy") : "Not set"}
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              New Start Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMMM d, yyyy") : "Select start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              New End Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMMM d, yyyy") : "Select end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setStartDate(undefined);
              setEndDate(undefined);
            }}
            disabled={!startDate && !endDate}
          >
            Clear
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending || (!startDate && !endDate)}
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
