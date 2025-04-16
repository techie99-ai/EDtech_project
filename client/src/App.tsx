import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import LDDashboardPage from "@/pages/ld-dashboard-page";
import CoursesPage from "@/pages/courses-page";
import StrategiesPage from "@/pages/strategies-page";
import QuizPage from "@/pages/quiz-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/strategies" component={StrategiesPage} />
      
      {/* Learner protected routes */}
      <ProtectedRoute path="/dashboard" component={DashboardPage} role="learner" />
      <ProtectedRoute path="/quiz" component={QuizPage} />
      
      {/* L&D Professional protected routes */}
      <ProtectedRoute path="/ld-dashboard" component={LDDashboardPage} role="l&d_professional" />
      <ProtectedRoute path="/create-content" component={LDDashboardPage} role="l&d_professional" />
      <ProtectedRoute path="/push-content" component={LDDashboardPage} role="l&d_professional" />
      <ProtectedRoute path="/monitor" component={LDDashboardPage} role="l&d_professional" />
      
      {/* Common protected routes */}
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
