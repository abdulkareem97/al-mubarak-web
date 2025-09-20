"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Calendar,
} from "lucide-react";
import { useTourPackages } from "@/hooks/useTourPackages";
import { useState } from "react";
import millify from "millify";

function HoverValue({ value }: { value: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="text-2xl font-bold cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      ₹
      {hovered
        ? value.toLocaleString("en-IN") // full Indian format with commas
        : millify(value, { precision: 2, lowercase: true })}{" "}
      {/* 49,800 -> 49.8k */}
    </div>
  );
}

export function TourPackageStats() {
  const { data, isLoading } = useTourPackages(1, 100); // Get more data for stats

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const packages = data?.packages || [];
  const totalPackages = packages.length;
  const totalSeats = packages.reduce((sum, pkg) => sum + pkg.totalSeat, 0);
  const totalValue = packages.reduce(
    (sum, pkg) => sum + pkg.tourPrice * pkg.totalSeat,
    0
  );
  const avgPrice =
    totalPackages > 0
      ? packages.reduce((sum, pkg) => sum + pkg.tourPrice, 0) / totalPackages
      : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <HoverValue value={totalPackages} />
          <Badge variant="secondary" className="mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <HoverValue value={totalSeats} />
          <p className="text-xs text-muted-foreground mt-1">
            Across all packages
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <HoverValue value={totalValue} />
          <p className="text-xs text-muted-foreground mt-1">
            Combined package value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <HoverValue value={avgPrice} />
          <p className="text-xs text-muted-foreground mt-1">
            Per person average
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
