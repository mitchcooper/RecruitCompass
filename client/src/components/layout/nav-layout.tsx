import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText, BarChart3, Settings } from "lucide-react";

export function NavLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { path: "/scorecard", label: "Scorecard", icon: BarChart3 },
    { path: "/recruits", label: "Recruits", icon: Users },
    { path: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-6">
          <div className="mr-8">
            <Link href="/scorecard" className="flex items-center space-x-2 hover-elevate rounded-md px-3 py-2" data-testid="link-home">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Recruitment Tracker</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
