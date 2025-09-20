// lib/payment-utils.ts
import { TourMember, PaymentStatus } from "@/types/payment-reminder";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for conditional classes (if not already in utils.ts)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate due amount for a tour member
export function calculateDueAmount(member: TourMember): number {
  const paidAmount = member.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return Math.max(0, member.totalCost - paidAmount);
}

// Calculate payment progress percentage
export function calculatePaymentProgress(member: TourMember): number {
  const paidAmount = member.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return member.totalCost > 0 ? (paidAmount / member.totalCost) * 100 : 0;
}

// Get payment status color
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors = {
    [PaymentStatus.PENDING]: "text-orange-600 bg-orange-100",
    [PaymentStatus.PARTIAL]: "text-blue-600 bg-blue-100", 
    [PaymentStatus.PAID]: "text-green-600 bg-green-100",
    [PaymentStatus.OVERDUE]: "text-red-600 bg-red-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "";
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  // Format as +91 XXXXX XXXXX if it's 10 digits
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  // Format with country code if present
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// Generate SMS message with placeholders
export function generateSmsMessage(
  template: string,
  member: TourMember,
  dueAmount?: number
): string {
  const primaryMember = member.members[0];
  const amount = dueAmount || calculateDueAmount(member);
  
  return template
    .replace(/{name}/g, primaryMember?.name || "")
    .replace(/{amount}/g, amount.toLocaleString())
    .replace(/{tourPackage}/g, member.tourPackage.packageName)
    .replace(/{phone}/g, primaryMember?.mobileNo || "")
    .replace(/{memberCount}/g, member.memberCount.toString());
}

// Check if payment is overdue (example logic)
export function isPaymentOverdue(member: TourMember): boolean {
  if (member.paymentStatus === PaymentStatus.OVERDUE) return true;
  
  // Check if payment is pending for more than 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return (
    member.paymentStatus === PaymentStatus.PENDING &&
    new Date(member.createdAt) < thirtyDaysAgo
  );
}

// Sort members by priority (overdue first, then by amount due)
export function sortMembersByPriority(members: TourMember[]): TourMember[] {
  return [...members].sort((a, b) => {
    // Overdue members first
    const aOverdue = isPaymentOverdue(a);
    const bOverdue = isPaymentOverdue(b);
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Then by due amount (highest first)
    const aDue = calculateDueAmount(a);
    const bDue = calculateDueAmount(b);
    
    return bDue - aDue;
  });
}

// Filter members by search term
export function filterMembersBySearch(members: TourMember[], searchTerm: string): TourMember[] {
  if (!searchTerm.trim()) return members;
  
  const term = searchTerm.toLowerCase();
  
  return members.filter(member => {
    const primaryMember = member.members[0];
    return (
      primaryMember?.name?.toLowerCase().includes(term) ||
      primaryMember?.mobileNo?.includes(term) ||
      primaryMember?.address?.toLowerCase().includes(term) ||
      member.tourPackage.packageName.toLowerCase().includes(term)
    );
  });
}

// Get reminder frequency suggestions
export function getReminderFrequency(member: TourMember): string {
  const dueAmount = calculateDueAmount(member);
  const isHighValue = dueAmount > 50000;
  const reminderCount = member.reminderCount;
  
  if (reminderCount === 0) {
    return "First reminder";
  } else if (reminderCount < 3) {
    return isHighValue ? "Weekly" : "Bi-weekly";
  } else {
    return isHighValue ? "Every 3 days" : "Weekly";
  }
}

// Calculate total statistics
export function calculateTotalStats(members: TourMember[]) {
  const totalMembers = members.length;
  const totalDue = members.reduce((sum, member) => sum + calculateDueAmount(member), 0);
  const overdueMembers = members.filter(isPaymentOverdue).length;
  const avgDueAmount = totalMembers > 0 ? totalDue / totalMembers : 0;
  
  return {
    totalMembers,
    totalDue,
    overdueMembers,
    avgDueAmount,
    pendingMembers: members.filter(m => m.paymentStatus === PaymentStatus.PENDING).length,
    partialMembers: members.filter(m => m.paymentStatus === PaymentStatus.PARTIAL).length,
  };
}

// Validate SMS message
export function validateSmsMessage(message: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!message.trim()) {
    errors.push("Message cannot be empty");
  }
  
  if (message.length > 1600) {
    errors.push("Message is too long (max 1600 characters)");
  }
  
  // Check for required placeholders if it's a template
  const hasNamePlaceholder = message.includes("{name}");
  const hasAmountPlaceholder = message.includes("{amount}");
  
  if (message.includes("{") && !hasNamePlaceholder) {
    errors.push("Consider including {name} placeholder for personalization");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Export default templates
export const DEFAULT_SMS_TEMPLATES = [
  {
    id: "payment-reminder",
    name: "Payment Reminder",
    message: "Dear {name}, this is a friendly reminder that your payment of ₹{amount} for {tourPackage} is pending. Please complete your payment at your earliest convenience. Thank you!",
    category: "reminder"
  },
  {
    id: "urgent-payment", 
    name: "Urgent Payment",
    message: "Hi {name}, your payment of ₹{amount} for {tourPackage} is overdue. Please make the payment immediately to avoid any inconvenience. Contact us for assistance.",
    category: "urgent"
  },
  {
    id: "final-notice",
    name: "Final Notice", 
    message: "Dear {name}, this is the final notice for your pending payment of ₹{amount} for {tourPackage}. Please settle this amount today to secure your booking.",
    category: "final"
  },
  {
    id: "partial-payment",
    name: "Partial Payment Received",
    message: "Thank you {name} for your partial payment. Your remaining balance for {tourPackage} is ₹{amount}. Please complete the payment before the due date.",
    category: "partial"
  },
  {
    id: "custom",
    name: "Custom Message",
    message: "",
    category: "custom"
  }
];