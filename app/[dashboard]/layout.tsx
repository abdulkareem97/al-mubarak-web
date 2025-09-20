"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);
  return (
    <div>
      {/* <ProtectedRoute> */}
      <DashboardLayout userRole={user?.role as any}>{children}</DashboardLayout>
      {/* </ProtectedRoute> */}
    </div>
  );
}
