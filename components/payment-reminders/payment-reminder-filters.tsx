// components/payment-reminders/payment-reminder-filters.tsx
import { useState } from "react";
import { CalendarIcon, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PaymentReminderFilters as FilterType,
  PaymentStatus,
  TourPackage,
} from "@/types/payment-reminder";

interface PaymentReminderFiltersProps {
  filters: FilterType;
  onFiltersChange: (key: keyof FilterType, value: any) => void;
  tourPackages: TourPackage[];
  clearFilters: () => void;
}

export function PaymentReminderFilters({
  filters,
  onFiltersChange,
  tourPackages,
  clearFilters,
}: PaymentReminderFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  //   console.log("tour packages", tourPackages);

  const updateFilter = (key: keyof FilterType, value: any) => {
    console.log("updating filter", key, value);
    onFiltersChange(key, value);
  };

  const updateDateRange = (field: "from" | "to", date: Date | undefined) => {
    onFiltersChange(field as keyof FilterType, date);
  };

  //   const clearFilters = () => {
  //     onFiltersChange({
  //       search: "",
  //       tourPackageId: "",
  //       paymentStatus: "" as PaymentStatus | "",
  //       paymentType: "",
  //       dateRange: {
  //         from: undefined,
  //         to: undefined,
  //       },
  //     });
  //   };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.tourPackageId) count++;
    if (filters.paymentStatus) count++;
    if (filters.paymentType) count++;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 lg:px-3"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 px-2 lg:px-3"
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Always visible: Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Members
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by member name, mobile, or address..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Expandable filters */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tour Package Filter */}
              <div>
                <Label className="text-sm font-medium">Tour Package</Label>
                <Select
                  value={filters.tourPackageId}
                  onValueChange={(value) =>
                    updateFilter("tourPackageId", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All packages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All packages">All packages</SelectItem>
                    {tourPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.packageName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status Filter */}
              <div>
                <Label className="text-sm font-medium">Payment Status</Label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) =>
                    updateFilter("paymentStatus", value as PaymentStatus | "")
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All statuses">All statuses</SelectItem>
                    <SelectItem value={PaymentStatus.PENDING}>
                      Pending
                    </SelectItem>
                    <SelectItem value={PaymentStatus.PARTIAL}>
                      Partial
                    </SelectItem>
                    <SelectItem value={PaymentStatus.OVERDUE}>
                      Overdue
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Type Filter */}
              <div>
                <Label className="text-sm font-medium">Payment Type</Label>
                <Select
                  value={filters.paymentType}
                  onValueChange={(value) => updateFilter("paymentType", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All types">All types</SelectItem>
                    <SelectItem value="FULL">Full Payment</SelectItem>
                    <SelectItem value="INSTALLMENT">Installment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div>
                <Label className="text-sm font-medium">Created Date</Label>
                <div className="flex gap-2 mt-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          format(filters.dateRange.from, "MMM dd")
                        ) : (
                          <span>From</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) => updateDateRange("from", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal flex-1",
                          !filters.dateRange.to && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? (
                          format(filters.dateRange.to, "MMM dd")
                        ) : (
                          <span>To</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) => updateDateRange("to", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
