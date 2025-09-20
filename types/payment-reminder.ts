// types/payment-reminder.ts
export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum PaymentType {
  FULL = "FULL",
  INSTALLMENT = "INSTALLMENT",
}

export interface Member {
  id: string;
  name: string;
  mobileNo: string;
  address: string;
  document: any;
  extra?: any;
  userid: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  tourMemberId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourPackage {
  id: string;
  packageName: string;
  tourPrice: number;
  totalSeat: number;
  coverPhoto?: string;
  desc: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourMember {
  id: string;
  members: Member[];
  memberIds: any;
  tourPackage: TourPackage;
  tourPackageId: string;
  payments: Payment[];
  packagePrice: number;
  memberCount: number;
  netCost: number;
  discount?: number;
  totalCost: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  nextReminder?: Date;
  lastReminder?: Date;
  reminderCount: number;
  extra?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentReminderFilters {
  search: string;
  tourPackageId: string;
  paymentStatus: PaymentStatus | "";
  paymentType: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export interface BulkSmsPayload {
  memberIds: string[];
  message: string;
  scheduleDate?: Date;
}