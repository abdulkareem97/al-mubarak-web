import { Member } from "./member";


export interface TourPackage {
  id: string;
  packageName: string;
  tourPrice: number;
  description?: string;
}

export interface Payment {
  id: string;
  tourMemberId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  note?: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export interface TourMember {
  id: string;
  memberIds: string[];
  tourPackageId: string;
  packagePrice: number;
  memberCount: number;
  netCost: number;
  discount?: number;
  totalCost: number;
  paymentType: PaymentType;
  paymentStatus: 'PENDING' | 'PARTIAL' | 'PAID';
  nextReminder?: string;
  lastReminder?: string;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
  // Relations
  members?: Member[];
  tourPackage?: TourPackage;
  payments?: Payment[];
}

export interface TourMemberStats {
     totalBookings: number,
      pendingPayments: number,
      partialPayments: number,
      paidBookings: number,
      totalRevenue: number,
      totalActiveTours: number,
}

export type PaymentType = 'ONE_TIME' | 'EMI' | 'PARTIAL';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';