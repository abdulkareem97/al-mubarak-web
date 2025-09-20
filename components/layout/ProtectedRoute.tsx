// src/components/layout/ProtectedRoute.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "USER";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute useEffect called", isAuthenticated);
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (requiredRole && user && user.role !== requiredRole) {
      // Redirect to unauthorized page or dashboard
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, user, requiredRole, router, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user && user.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};
