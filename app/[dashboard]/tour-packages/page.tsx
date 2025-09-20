// app/dashboard/tour-packages/page.tsx (Updated)
import { TourPackageTable } from "@/components/tour-packages/tour-package-table";
import { TourPackageStats } from "@/components/tour-packages/tour-package-stats";

export default function TourPackagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TourPackageStats />
      <TourPackageTable />
    </div>
  );
}
