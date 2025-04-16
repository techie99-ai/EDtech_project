import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  role?: string; // Optional role requirement
}

export function ProtectedRoute({ path, component: Component, role }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/auth" />;
        }

        // If role is specified, check if user has that role
        if (role && user.role !== role) {
          return <Redirect to={user.role === "l&d_professional" ? "/ld-dashboard" : "/dashboard"} />;
        }

        return <Component />;
      }}
    </Route>
  );
}