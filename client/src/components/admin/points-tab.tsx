import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTypesWithPoints, useUpsertPoints } from "@/hooks/use-points";
import { useToast } from "@/hooks/use-toast";

const pointsFormSchema = z.object({
  points: z.coerce.number().min(0, "Points must be at least 0"),
});

type PointsFormData = z.infer<typeof pointsFormSchema>;

export function PointsTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<{ id: string; name: string; points: number } | null>(null);
  const { toast } = useToast();

  const { data: typesWithPoints = [], isLoading } = useTypesWithPoints();
  const upsertPoints = useUpsertPoints();

  const form = useForm<PointsFormData>({
    resolver: zodResolver(pointsFormSchema),
    defaultValues: {
      points: 0,
    },
  });

  const onSubmit = async (data: PointsFormData) => {
    if (!editingType) return;
    try {
      await upsertPoints.mutateAsync({
        typeId: editingType.id,
        points: data.points,
      });
      toast({ title: "Points updated successfully" });
      setDialogOpen(false);
      form.reset();
      setEditingType(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update points",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (type: { id: string; name: string; points: number }) => {
    setEditingType(type);
    form.reset({
      points: type.points,
    });
    setDialogOpen(true);
  };

  const typesWithPointsData = typesWithPoints.map((type) => ({
    id: type.id,
    name: type.name,
    points: type.points?.points || 0,
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Points Allocation</CardTitle>
          <CardDescription className="mt-2">
            Assign point values to each recruitment type for competition scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : typesWithPointsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No recruitment types available. Add types first to allocate points.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead className="text-right">Points Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {typesWithPointsData.map((type) => (
                    <TableRow key={type.id} data-testid={`row-points-${type.id}`}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="font-semibold text-base">
                          {type.points} pts
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(type)}
                          data-testid={`button-edit-points-${type.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-points-form">
          <DialogHeader>
            <DialogTitle>Edit Points for {editingType?.name}</DialogTitle>
            <DialogDescription>
              Update the point value for this recruitment type
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter points value"
                        {...field}
                        data-testid="input-points-value"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={upsertPoints.isPending} data-testid="button-submit-points">
                  {upsertPoints.isPending ? "Updating..." : "Update Points"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
