import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { insertLeaderSchema, type InsertLeader, type Leader } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaders, useCreateLeader, useUpdateLeader, useDeleteLeader } from "@/hooks/use-leaders";
import { useToast } from "@/hooks/use-toast";

export function LeadersTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const { toast } = useToast();

  const { data: leaders = [], isLoading } = useLeaders();
  const createLeader = useCreateLeader();
  const updateLeader = useUpdateLeader();
  const deleteLeader = useDeleteLeader();

  const form = useForm<InsertLeader>({
    resolver: zodResolver(insertLeaderSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: InsertLeader) => {
    try {
      if (editingLeader) {
        await updateLeader.mutateAsync({ id: editingLeader.id, data });
        toast({ title: "Leader updated successfully" });
      } else {
        await createLeader.mutateAsync(data);
        toast({ title: "Leader created successfully" });
      }
      setDialogOpen(false);
      form.reset();
      setEditingLeader(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save leader",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    form.reset({
      name: leader.name,
      email: leader.email,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (leaderId: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    try {
      await deleteLeader.mutateAsync(leaderId);
      toast({ title: "Leader deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete leader",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingLeader(null);
    form.reset({
      name: "",
      email: "",
    });
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-semibold">Leaders</CardTitle>
            <CardDescription className="mt-2">
              Manage leaders who will have recruits recorded against them
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} data-testid="button-add-leader">
            <Plus className="h-4 w-4 mr-2" />
            Add Leader
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No leaders added yet</p>
              <Button variant="outline" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Leader
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Total Points</TableHead>
                    <TableHead className="text-right">Recruits Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaders.map((leader) => (
                    <TableRow key={leader.id} data-testid={`row-leader-${leader.id}`}>
                      <TableCell className="font-medium">{leader.name}</TableCell>
                      <TableCell className="text-muted-foreground">{leader.email}</TableCell>
                      <TableCell className="text-right font-semibold">0</TableCell>
                      <TableCell className="text-right">0</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(leader)}
                            data-testid={`button-edit-leader-${leader.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(leader.id)}
                            data-testid={`button-delete-leader-${leader.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
        <DialogContent data-testid="dialog-leader-form">
          <DialogHeader>
            <DialogTitle>
              {editingLeader ? "Edit Leader" : "Add New Leader"}
            </DialogTitle>
            <DialogDescription>
              {editingLeader
                ? "Update leader information"
                : "Add a new leader to track recruits"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter leader name"
                        {...field}
                        data-testid="input-leader-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter leader email"
                        {...field}
                        data-testid="input-leader-email"
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
                <Button type="submit" data-testid="button-submit-leader">
                  {editingLeader ? "Update" : "Add"} Leader
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
