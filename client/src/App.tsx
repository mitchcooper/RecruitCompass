import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavLayout } from "@/components/layout/nav-layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Admin from "@/pages/admin";
import Recruits from "@/pages/recruits";
import PublicForm from "@/pages/public-form";
import Scorecard from "@/pages/scorecard";
import Login from "@/pages/login";
import AuthCallback from "@/pages/auth-callback";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/scorecard" />} />
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/public-form" component={PublicForm} />
      <Route path="/scorecard">
        <ProtectedRoute>
          <NavLayout>
            <Scorecard />
          </NavLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/recruits">
        <ProtectedRoute>
          <NavLayout>
            <Recruits />
          </NavLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <NavLayout>
            <Admin />
          </NavLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
