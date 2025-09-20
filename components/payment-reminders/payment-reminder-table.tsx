// components/payment-reminders/payment-reminder-table.tsx
import { useState } from "react";
import { format } from "date-fns";
import {
  MessageSquare,
  Phone,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TourMember, PaymentStatus } from "@/types/payment-reminder";

interface PaymentReminderTableProps {
  members: TourMember[];
  selectedMembers: string[];
  isLoading: boolean;
  onSelectMember: (memberId: string) => void;
  onSelectAll: () => void;
  onSendIndividualSms: (member: TourMember) => void;
}

export function PaymentReminderTable({
  members,
  selectedMembers,
  isLoading,
  onSelectMember,
  onSelectAll,
  onSendIndividualSms,
}: PaymentReminderTableProps) {
  const [sortField, setSortField] = useState<keyof TourMember>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const variants: Record<
      PaymentStatus,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      [PaymentStatus.PENDING]: "destructive",
      [PaymentStatus.PARTIAL]: "outline",
      [PaymentStatus.PAID]: "default",
      [PaymentStatus.OVERDUE]: "destructive",
    };

    const icons: Record<PaymentStatus, React.ReactNode> = {
      [PaymentStatus.PENDING]: <Clock className="h-3 w-3" />,
      [PaymentStatus.PARTIAL]: <AlertCircle className="h-3 w-3" />,
      [PaymentStatus.PAID]: <CheckCircle2 className="h-3 w-3" />,
      [PaymentStatus.OVERDUE]: <AlertCircle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status}
      </Badge>
    );
  };

  const calculateDueAmount = (member: TourMember) => {
    const paidAmount = member.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return member.totalCost - paidAmount;
  };

  const calculateProgress = (member: TourMember) => {
    const paidAmount = member.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return (paidAmount / member.totalCost) * 100;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Payment Reminders...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No pending payments found
            </h3>
            <p className="text-muted-foreground">
              All members have completed their payments or no members match the
              current filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAllSelected = selectedMembers.length === members.length;
  const isPartiallySelected =
    selectedMembers.length > 0 && selectedMembers.length < members.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Reminders ({members.length})</span>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        isAllSelected
                          ? true
                          : isPartiallySelected
                          ? "indeterminate"
                          : false
                      }
                      onCheckedChange={onSelectAll}
                    />
                    <span>Select All</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isAllSelected
                    ? "Deselect all members"
                    : "Select all members"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      isAllSelected
                        ? true
                        : isPartiallySelected
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead>Member Details</TableHead>
                <TableHead>Tour Package</TableHead>
                <TableHead>Payment Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Reminder</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const dueAmount = calculateDueAmount(member);
                const progress = calculateProgress(member);
                const primaryMember = member.members[0];

                return (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => onSelectMember(member.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{primaryMember?.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {primaryMember?.mobileNo}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {primaryMember?.address.length > 30
                            ? `${primaryMember.address.substring(0, 30)}...`
                            : primaryMember?.address}
                        </div>
                        {member.memberCount > 1 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {member.memberCount} members
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {member.tourPackage.packageName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{member.packagePrice.toLocaleString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            Total: ₹{member.totalCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-destructive">
                            Due: ₹{dueAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {progress.toFixed(1)}% paid
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        {getPaymentStatusBadge(member.paymentStatus)}
                        <div className="text-xs text-muted-foreground">
                          {member.paymentType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {member.lastReminder ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {format(
                              new Date(member.lastReminder),
                              "MMM dd, yyyy"
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Never
                          </span>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {member.reminderCount} reminders sent
                        </div>
                        {member.nextReminder && (
                          <div className="text-xs text-blue-600">
                            Next:{" "}
                            {format(new Date(member.nextReminder), "MMM dd")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSendIndividualSms(member)}
                          className="flex items-center gap-1"
                        >
                          <MessageSquare className="h-3 w-3" />
                          SMS
                        </Button>
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Payment History</DropdownMenuItem>
                            <DropdownMenuItem>Update Status</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
