// components/tour-packages/tour-package-export.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Table, Image } from "lucide-react";
import { useTourPackages } from "@/hooks/useTourPackages";
import { toast } from "sonner";

export function TourPackageExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { data } = useTourPackages(1, 1000); // Get all packages for export

  const exportToCSV = () => {
    if (!data?.packages?.length) {
      toast.error("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      const headers = [
        "Package Name",
        "Tour Price",
        "Total Seats",
        "Total Value",
        "Description",
        "Created At",
      ];
      const csvContent = [
        headers.join(","),
        ...data.packages.map((pkg) =>
          [
            `"${pkg.packageName}"`,
            pkg.tourPrice,
            pkg.totalSeat,
            pkg.tourPrice * pkg.totalSeat,
            `"${pkg.desc.replace(/"/g, '""')}"`,
            new Date(pkg.createdAt || "").toISOString().split("T")[0],
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `tour-packages-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    // Implementation for PDF export would go here
    toast.info("PDF export coming soon");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV}>
          <Table className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
