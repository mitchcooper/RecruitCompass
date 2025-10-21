import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { LeadersTab } from "@/components/admin/leaders-tab";
import { TypesTab } from "@/components/admin/types-tab";
import { PointsTab } from "@/components/admin/points-tab";
import { UsersTab } from "@/components/admin/users-tab";
import { useSeedDatabase } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const seedDatabase = useSeedDatabase();
  const { toast } = useToast();

  const handleSeed = async () => {
    try {
      await seedDatabase.mutateAsync();
      toast({ title: "Database seeded successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
            Administration
          </h1>
          <p className="text-muted-foreground">
            Manage leaders, recruitment types, points allocation, and users
          </p>
        </div>
        <Button onClick={handleSeed} variant="outline" disabled={seedDatabase.isPending}>
          <Database className="h-4 w-4 mr-2" />
          {seedDatabase.isPending ? "Seeding..." : "Seed Data"}
        </Button>
      </div>

      <Tabs defaultValue="leaders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="leaders" className="text-sm" data-testid="tab-leaders">
            Leaders
          </TabsTrigger>
          <TabsTrigger value="types" className="text-sm" data-testid="tab-types">
            Types
          </TabsTrigger>
          <TabsTrigger value="points" className="text-sm" data-testid="tab-points">
            Points
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm" data-testid="tab-users">
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaders" className="space-y-4">
          <LeadersTab />
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <TypesTab />
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <PointsTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
