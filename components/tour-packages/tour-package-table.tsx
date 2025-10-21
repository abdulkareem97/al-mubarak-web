// components/tour-packages/tour-package-table.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  IndianRupee,
} from "lucide-react";
import { useTourPackages, useDeleteTourPackage } from "@/hooks/useTourPackages";
import { TourPackage } from "@/types/tour-package";
import { TourPackageFilters } from "./tour-package-filters";
import { TourPackageExport } from "./tour-package-export";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  minSeats: string;
  maxSeats: string;
  sortBy: string;
  sortOrder: string;
}

export function TourPackageTable() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    minPrice: "",
    maxPrice: "",
    minSeats: "",
    maxSeats: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { user } = useAuth();

  const isUserAdmin = user?.role === "ADMIN";

  const limit = 10;

  const router = useRouter();
  const { data, isLoading, error } = useTourPackages(
    page,
    limit,
    filters.search,
    filters
  );
  const deleteMutation = useDeleteTourPackage();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting tour package:", error);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      minSeats: "",
      maxSeats: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value && value !== "all" && value !== "desc" && value !== "createdAt"
  );

  if (error) {
    toast.error("Failed to load tour packages");
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tour Packages</h2>
          <p className="text-muted-foreground">
            Manage your tour packages and bookings
          </p>
        </div>
        {isUserAdmin && (
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Export Component */}
            <TourPackageExport />
            <Button
              onClick={() => router.push("/dashboard/tour-packages/create")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={filters.search}
                onChange={(e) =>
                  handleFiltersChange({ ...filters, search: e.target.value })
                }
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFilters ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="shrink-0"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 w-5 p-0 text-xs"
                  >
                    {
                      Object.values(filters).filter(
                        (v) =>
                          v && v !== "all" && v !== "desc" && v !== "createdAt"
                      ).length
                    }
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters Component - Shows when toggled */}
        {showFilters && (
          <div className="px-6 pb-4">
            <TourPackageFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
            />
          </div>
        )}

        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : !data?.packages?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No tour packages found
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Package</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Status</TableHead>
                      {isUserAdmin && <TableHead>Last Edited By</TableHead>}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.packages.map((pkg: TourPackage) => (
                      <TableRow key={pkg.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={"pkg.coverPhoto"}
                                alt={pkg.packageName}
                              />
                              <AvatarFallback>
                                {pkg.packageName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{pkg.packageName}</p>
                              <p className="text-sm text-muted-foreground">
                                {pkg.desc.substring(0, 50)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex">
                            ₹{pkg.tourPrice.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{pkg.totalSeat}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            ₹ {(pkg.tourPrice * pkg.totalSeat).toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Active</Badge>
                        </TableCell>
                        {isUserAdmin && (
                          <TableCell>{pkg.createdBy?.email}</TableCell>
                        )}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/tour-packages/${pkg.id}`
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              {isUserAdmin && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/tour-packages/${pkg.id}/edit`
                                      )
                                    }
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setDeleteId(pkg.id)}
                                    className="text-red-600"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data.packages.map((pkg: TourPackage) => (
                  <Card key={pkg.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={"pkg.coverPhoto"}
                            alt={pkg.packageName}
                          />
                          <AvatarFallback>
                            {pkg.packageName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{pkg.packageName}</h3>
                          <p className="text-sm text-muted-foreground">
                            ₹ {pkg.tourPrice} × {pkg.totalSeat} seats
                          </p>
                          <Badge variant="secondary" className="mt-1">
                            Total: ₹{(pkg.tourPrice * pkg.totalSeat).toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/tour-packages/${pkg.id}`)
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/dashboard/tour-packages/${pkg.id}/edit`
                              )
                            }
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(pkg.id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, data.total)} of {data.total} results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tour Package</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tour package? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
