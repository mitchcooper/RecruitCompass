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
import { insertTypeSchema, type InsertType, type RecruiterType } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTypes, useCreateType, useUpdateType, useDeleteType } from "@/hooks/use-types";
import { useToast } from "@/hooks/use-toast";

export function TypesTab() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<RecruiterType | null>(null);
  const { toast } = useToast();

  const { data: types = [], isLoading } = useTypes();
  const createType = useCreateType();
  const updateType = useUpdateType();
  const deleteType = useDeleteType();

  const form = useForm<InsertType>({
    resolver: zodResolver(insertTypeSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: InsertType) => {
    try {
      if (editingType) {
        await updateType.mutateAsync({ id: editingType.id, data });
        toast({ title: "Type updated successfully" });
      } else {
        await createType.mutateAsync(data);
        toast({ title: "Type created successfully" });
      }
      setDialogOpen(false);
      form.reset();
      setEditingType(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save type",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (type: RecruiterType) => {
    setEditingType(type);
    form.reset({
      name: type.name,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (typeId: string) => {
    if (!confirm("Are you sure you want to delete this type?")) return;
    try {
      await deleteType.mutateAsync(typeId);
      toast({ title: "Type deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete type",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setEditingType(null);
    form.reset({
      name: "",
    });
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-semibold">Recruitment Types</CardTitle>
            <CardDescription className="mt-2">
              Define categories of recruitment for tracking and scoring
            </CardDescription>
          </div>
          <Button onClick={handleAddNew} data-testid="button-add-type">
            <Plus className="h-4 w-4 mr-2" />
            Add Type
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : types.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No recruitment types defined yet</p>
              <Button variant="outline" onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Type
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {types.map((type) => (
                    <TableRow key={type.id} data-testid={`row-type-${type.id}`}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(type)}
                            data-testid={`button-edit-type-${type.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(type.id)}
                            data-testid={`button-delete-type-${type.id}`}
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
        <DialogContent data-testid="dialog-type-form">
          <DialogHeader>
            <DialogTitle>
              {editingType ? "Edit Type" : "Add New Type"}
            </DialogTitle>
            <DialogDescription>
              {editingType
                ? "Update recruitment type information"
                : "Add a new recruitment type category"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Papers, New Starter, Established"
                        {...field}
                        data-testid="input-type-name"
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
                <Button type="submit" data-testid="button-submit-type">
                  {editingType ? "Update" : "Add"} Type
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
