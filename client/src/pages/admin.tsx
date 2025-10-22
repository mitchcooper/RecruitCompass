import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadersTab } from "@/components/admin/leaders-tab";
import { TypesTab } from "@/components/admin/types-tab";
import { PointsTab } from "@/components/admin/points-tab";
import { UserProfilesTab } from "@/components/admin/user-profiles-tab";
import { CompetitionTab } from "@/components/admin/competition-tab";

export default function Admin() {

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
          Administration
        </h1>
        <p className="text-muted-foreground">
          Manage leaders, recruitment types, points allocation, competition period, and users
        </p>
      </div>


      <Tabs defaultValue="leaders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="leaders" className="text-sm" data-testid="tab-leaders">
            Leaders
          </TabsTrigger>
          <TabsTrigger value="types" className="text-sm" data-testid="tab-types">
            Types
          </TabsTrigger>
          <TabsTrigger value="points" className="text-sm" data-testid="tab-points">
            Points
          </TabsTrigger>
          <TabsTrigger value="competition" className="text-sm" data-testid="tab-competition">
            Competition
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm" data-testid="tab-users">
            User Access
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

        <TabsContent value="competition" className="space-y-4">
          <CompetitionTab />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserProfilesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
