// app/dashboard/tour-packages/page.tsx (Updated)
"use client";
import { TourPackageTable } from "@/components/tour-packages/tour-package-table";
import { TourPackageStats } from "@/components/tour-packages/tour-package-stats";
import { useAuth } from "@/hooks/useAuth";

export default function TourPackagesPage() {
  const { user } = useAuth();
  const isUserAdmin = user?.role === "ADMIN";
  return (
    <div className="container mx-auto px-4 py-8">
      {isUserAdmin && <TourPackageStats />}
      <TourPackageTable />
    </div>
  );
}
