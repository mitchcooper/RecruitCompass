import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X, User, Shield, Loader2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfiles, useAddModuleToUser, useRemoveModuleFromUser } from "@/hooks/use-user-profiles";
import { useToast } from "@/hooks/use-toast";

const AVAILABLE_MODULES = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'new_listings', label: 'New Listings' },
  { value: 'latest_sales', label: 'Latest Sales' },
  { value: 'auctions', label: 'Auctions' },
];

export function UserProfilesTab() {
  const [addModuleDialogOpen, setAddModuleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; display_name: string; modules: string[] } | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('');
  const { toast } = useToast();

  const { data: profiles = [], isLoading } = useUserProfiles();
  const addModule = useAddModuleToUser();
  const removeModule = useRemoveModuleFromUser();

  const handleAddModule = async () => {
    if (!selectedUser || !selectedModule) return;

    try {
      await addModule.mutateAsync({ userId: selectedUser.id, module: selectedModule });
      toast({ title: "Module added successfully" });
      setAddModuleDialogOpen(false);
      setSelectedUser(null);
      setSelectedModule('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add module",
        variant: "destructive",
      });
    }
  };

  const handleRemoveModule = async (userId: string, module: string) => {
    try {
      await removeModule.mutateAsync({ userId, module });
      toast({ title: "Module removed successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove module",
        variant: "destructive",
      });
    }
  };

  const openAddModuleDialog = (profile: any) => {
    setSelectedUser(profile);
    setAddModuleDialogOpen(true);
  };

  const getAvailableModules = (currentModules: string[]) => {
    return AVAILABLE_MODULES.filter(module => !currentModules.includes(module.value));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-semibold">User Management</CardTitle>
            <CardDescription className="mt-2">
              Manage user access to modules and permissions
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No users found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.display_name}</TableCell>
                      <TableCell className="text-muted-foreground">{profile.email}</TableCell>
                      <TableCell>
                        <Badge variant={profile.is_admin ? 'default' : 'secondary'}>
                          {profile.is_admin ? 'Admin' : 'User'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {profile.modules?.map((module) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleRemoveModule(profile.id, module)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          )) || <span className="text-muted-foreground text-sm">No modules</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAddModuleDialog(profile)}
                          disabled={getAvailableModules(profile.modules || []).length === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Module
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

      <Dialog open={addModuleDialogOpen} onOpenChange={setAddModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Module to User</DialogTitle>
            <DialogDescription>
              Add a module to {selectedUser?.display_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Module</label>
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a module" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUser && getAvailableModules(selectedUser.modules || []).map((module) => (
                    <SelectItem key={module.value} value={module.value}>
                      {module.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddModuleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddModule}
              disabled={!selectedModule || addModule.isPending}
            >
              {addModule.isPending ? "Adding..." : "Add Module"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
