import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile } from "@/hooks/useQueries";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { UserRole } from "../../../src/backend.d";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: string;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = "/",
}: RoleGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();

  if (isInitializing || isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!identity) {
    return <Navigate to="/" />;
  }

  if (!profile) {
    return <Navigate to="/register" />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={fallback} />;
  }

  return <>{children}</>;
}
