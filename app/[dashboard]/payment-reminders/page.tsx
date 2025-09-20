// app/payment-reminders/page.tsx (Enhanced Version)
"use client";

import { useState } from "react";
import {
  usePaymentReminders,
  useTourPackages,
} from "@/hooks/use-payment-reminders";
import { usePaymentReminderFilters } from "@/hooks/use-payment-reminder-filters";
import { useSelection } from "@/hooks/use-selection";
import { PaymentReminderFilters } from "@/components/payment-reminders/payment-reminder-filters";
import { PaymentReminderTable } from "@/components/payment-reminders/payment-reminder-table";
import { BulkSmsDialog } from "@/components/payment-reminders/bulk-sms-dialog";
import { IndividualSmsDialog } from "@/components/payment-reminders/individual-sms-dialog";
import { PaymentRemindersLayout } from "@/components/payment-reminders/payment-reminders-layout";
import { ErrorState } from "@/components/payment-reminders/error-state";
import { EmptyState } from "@/components/payment-reminders/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  DollarSign,
  Clock,
  RefreshCw,
  Download,
} from "lucide-react";
import { TourMember } from "@/types/payment-reminder";
import {
  calculateTotalStats,
  filterMembersBySearch,
} from "@/lib/payment-utils";
import { toast } from "sonner"; // Assuming you have sonner for toasts

export default function PaymentRemindersPage() {
  const {
    filters,
    debouncedFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  } = usePaymentReminderFilters();

  const [isBulkSmsOpen, setIsBulkSmsOpen] = useState(false);
  const [individualSmsTarget, setIndividualSmsTarget] =
    useState<TourMember | null>(null);

  // API queries
  const {
    data: tourMembers = [],
    isLoading,
    error,
    refetch,
  } = usePaymentReminders(debouncedFilters);

  const { data: tourPackages = [] } = useTourPackages();

  // Client-side filtering for search (additional layer)
  const filteredMembers = filterMembersBySearch(tourMembers, filters.search);

  // Selection management
  const selection = useSelection(filteredMembers);

  // Stats calculation
  const stats = calculateTotalStats(filteredMembers);

  const handleSendBulkSms = () => {
    if (selection.selectedCount === 0) {
      toast.error("Please select at least one member to send SMS");
      return;
    }

    console.log(
      "Opening bulk SMS dialog for:",
      selection.selectedItems.map((member) => ({
        name: member.members[0]?.name,
        phone: member.members[0]?.mobileNo,
        paymentDue:
          member.totalCost -
          member.payments.reduce((sum, payment) => sum + payment.amount, 0),
      }))
    );

    setIsBulkSmsOpen(true);
  };

  const handleSendIndividualSms = (member: TourMember) => {
    console.log("Opening individual SMS dialog for:", {
      name: member.members[0]?.name,
      phone: member.members[0]?.mobileNo,
      paymentDue:
        member.totalCost -
        member.payments.reduce((sum, payment) => sum + payment.amount, 0),
    });

    setIndividualSmsTarget(member);
  };

  const handleExport = () => {
    console.log("Exporting payment reminders data:", filteredMembers);
    toast.success("Export feature will be implemented soon");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Data refreshed");
  };

  if (error) {
    return (
      <PaymentRemindersLayout>
        <div className="container mx-auto p-6">
          <ErrorState
            error={error}
            onRetry={refetch}
            title="Failed to load payment reminders"
          />
        </div>
      </PaymentRemindersLayout>
    );
  }

  return (
    <PaymentRemindersLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Payment Reminders</h1>
            <p className="text-muted-foreground">
              Manage and send payment reminders to tour members
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={handleSendBulkSms}
              disabled={selection.selectedCount === 0}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send Bulk SMS ({selection.selectedCount})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingMembers} pending, {stats.partialMembers} partial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Due Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalDue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: ₹{stats.avgDueAmount.toFixed(0)} per member
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {stats.overdueMembers}
              </div>
              <p className="text-xs text-muted-foreground">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Selected</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {selection.selectedCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for bulk SMS
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <PaymentReminderFilters
          filters={filters}
          onFiltersChange={(filterKey, filterValue) => {
            // Object.keys(newFilters).forEach((key) => {
            //   const filterKey = key as keyof typeof newFilters;
            //   updateFilter(filterKey, newFilters[filterKey]);
            // });
            updateFilter(filterKey, filterValue);
            selection.clearSelection(); // Clear selection when filters change
          }}
          clearFilters={clearFilters}
          tourPackages={tourPackages}
        />

        {/* Main Content */}
        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">Loading payment reminders...</div>
            </CardContent>
          </Card>
        ) : filteredMembers.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              type="no-results"
              onAction={clearFilters}
              actionLabel="Clear Filters"
            />
          ) : (
            <EmptyState type="no-data" />
          )
        ) : (
          <PaymentReminderTable
            members={filteredMembers}
            selectedMembers={selection.selectedIds}
            isLoading={isLoading}
            onSelectMember={selection.select}
            onSelectAll={selection.selectAll}
            onSendIndividualSms={handleSendIndividualSms}
          />
        )}

        {/* Dialogs */}
        <BulkSmsDialog
          isOpen={isBulkSmsOpen}
          onClose={() => {
            setIsBulkSmsOpen(false);
            selection.clearSelection(); // Clear selection after sending
          }}
          selectedMembers={selection.selectedItems}
        />

        <IndividualSmsDialog
          isOpen={!!individualSmsTarget}
          onClose={() => setIndividualSmsTarget(null)}
          member={individualSmsTarget}
        />
      </div>
    </PaymentRemindersLayout>
  );
}
