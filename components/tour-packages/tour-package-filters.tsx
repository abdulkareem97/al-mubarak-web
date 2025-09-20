// components/tour-packages/tour-package-filters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  minSeats: string;
  maxSeats: string;
  sortBy: string;
  sortOrder: string;
}

interface TourPackageFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function TourPackageFilters({
  filters,
  onFiltersChange,
  onReset,
}: TourPackageFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all" && value !== "asc"
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {
                  Object.values(filters).filter(
                    (v) => v && v !== "all" && v !== "asc"
                  ).length
                }
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 px-2"
              >
                <X className="h-4 w-4" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-2 md:hidden"
            >
              {isExpanded ? "Less" : "More"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={`space-y-4 ${!isExpanded ? "hidden md:block" : ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Min Price */}
          <div className="space-y-2">
            <Label className="text-sm">Min Price</Label>
            <Input
              type="number"
              placeholder="0.00"
              className="h-9"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
            />
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label className="text-sm">Max Price</Label>
            <Input
              type="number"
              placeholder="1000.00"
              className="h-9"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
            />
          </div>

          {/* Min Seats */}
          <div className="space-y-2">
            <Label className="text-sm">Min Seats</Label>
            <Input
              type="number"
              placeholder="1"
              className="h-9"
              value={filters.minSeats}
              onChange={(e) => updateFilter("minSeats", e.target.value)}
            />
          </div>

          {/* Max Seats */}
          <div className="space-y-2">
            <Label className="text-sm">Max Seats</Label>
            <Input
              type="number"
              placeholder="50"
              className="h-9"
              value={filters.maxSeats}
              onChange={(e) => updateFilter("maxSeats", e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm">Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="packageName">Package Name</SelectItem>
                <SelectItem value="tourPrice">Price</SelectItem>
                <SelectItem value="totalSeat">Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label className="text-sm">Order</Label>
            <Select
              value={filters.sortOrder}
              onValueChange={(value) => updateFilter("sortOrder", value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
