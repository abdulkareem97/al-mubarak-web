"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Toaster } from "sonner";

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
      <Toaster />
      <DashboardLayout userRole={user?.role as any}>{children}</DashboardLayout>
      {/* </ProtectedRoute> */}
    </div>
  );
}
