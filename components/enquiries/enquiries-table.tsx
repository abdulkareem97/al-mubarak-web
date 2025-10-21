// components/enquiries/enquiries-table.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EnquiryForm, EnquiryFormStatus } from "@/types/enquiry";
import { enquiriesApi } from "@/lib/api/enquiry";
import { EnquiryFormDialog } from "./enquiry-form-dialog";
import { useAuth } from "@/hooks/useAuth";
import is from "zod/v4/locales/is.cjs";

const getStatusBadge = (status: EnquiryFormStatus) => {
  switch (status) {
    case EnquiryFormStatus.PENDING:
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case EnquiryFormStatus.BOOKED:
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Booked
        </Badge>
      );
    case EnquiryFormStatus.NOT_INTERESTED:
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Not Interested
        </Badge>
      );
  }
};

export function EnquiriesTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryForm | null>(
    null
  );
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<EnquiryForm | null>(
    null
  );

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isUserAdmin = user?.role === "ADMIN";

  const {
    data: enquiriesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enquiries", pagination.pageIndex + 1, pagination.pageSize],
    queryFn: () =>
      enquiriesApi.getEnquiries(pagination.pageIndex + 1, pagination.pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: enquiriesApi.deleteEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry deleted successfully");
      setShowDeleteDialog(false);
      setEnquiryToDelete(null);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete enquiry");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryFormStatus }) =>
      enquiriesApi.updateEnquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const columns: ColumnDef<EnquiryForm>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("phone")}</span>
        </div>
      ),
    },
    {
      accessorKey: "purpose",
      header: "Purpose",
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.getValue("purpose")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as EnquiryFormStatus;
        return getStatusBadge(status);
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}
          </span>
        </div>
      ),
    },
    ...(isUserAdmin
      ? [
          {
            accessorKey: "createdBy",
            header: "Last Edited By",
            cell: ({ row }) => (
              <div className="flex items-start space-x-2">
                <span className="max-w-xs truncate">
                  {(row.getValue("createdBy") as { email?: string })?.email ??
                    "N/A"}
                </span>
              </div>
            ),
          },
        ]
      : []),
    {
      id: "actions",
      cell: ({ row }) => {
        const enquiry = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedEnquiry(enquiry);
                  setShowFormDialog(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: enquiry.id,
                    status: EnquiryFormStatus.PENDING,
                  })
                }
                disabled={enquiry.status === EnquiryFormStatus.PENDING}
              >
                <Clock className="mr-2 h-4 w-4" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: enquiry.id,
                    status: EnquiryFormStatus.BOOKED,
                  })
                }
                disabled={enquiry.status === EnquiryFormStatus.BOOKED}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Booked
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: enquiry.id,
                    status: EnquiryFormStatus.NOT_INTERESTED,
                  })
                }
                disabled={enquiry.status === EnquiryFormStatus.NOT_INTERESTED}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Mark as Not Interested
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isUserAdmin && (
                <DropdownMenuItem
                  onClick={() => {
                    setEnquiryToDelete(enquiry);
                    setShowDeleteDialog(true);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: enquiriesData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      pagination,
      globalFilter,
    },
    pageCount: Math.ceil((enquiriesData?.total || 0) / pagination.pageSize),
    manualPagination: true,
  });

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Error loading enquiries. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    total: enquiriesData?.total || 0,
    pending:
      enquiriesData?.data.filter(
        (e: EnquiryForm) => e.status === EnquiryFormStatus.PENDING
      ).length || 0,
    booked:
      enquiriesData?.data.filter(
        (e: EnquiryForm) => e.status === EnquiryFormStatus.BOOKED
      ).length || 0,
    notInterested:
      enquiriesData?.data.filter(
        (e: EnquiryForm) => e.status === EnquiryFormStatus.NOT_INTERESTED
      ).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Enquiries</h1>
          <p className="text-muted-foreground">
            Manage customer enquiries and bookings
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEnquiry(null);
            setShowFormDialog(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Enquiry
        </Button>
      </div>

      {/* Stats Cards */}
      {isUserAdmin && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booked</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.booked}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Not Interested
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notInterested}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search enquiries..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Enquiries List ({enquiriesData?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Loading enquiries...
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No enquiries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                enquiriesData?.total || 0
              )}{" "}
              of {enquiriesData?.total || 0} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <EnquiryFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        enquiry={selectedEnquiry}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              enquiry from "{enquiryToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (enquiryToDelete) {
                  deleteMutation.mutate(enquiryToDelete.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
