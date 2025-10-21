import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavLayout } from "@/components/layout/nav-layout";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/admin";
import Recruits from "@/pages/recruits";
import PublicForm from "@/pages/public-form";
import Scorecard from "@/pages/scorecard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/scorecard" />} />
      <Route path="/public-form" component={PublicForm} />
      <Route path="/scorecard">
        <NavLayout>
          <Scorecard />
        </NavLayout>
      </Route>
      <Route path="/recruits">
        <NavLayout>
          <Recruits />
        </NavLayout>
      </Route>
      <Route path="/admin">
        <NavLayout>
          <Admin />
        </NavLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
