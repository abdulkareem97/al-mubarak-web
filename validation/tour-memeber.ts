// File: /lib/validations/tour-member.ts
import * as z from 'zod';

export const tourMemberSchema = z.object({
  memberIds: z.array(z.string()).min(1, 'Please select at least one member'),
  tourPackageId: z.string().min(1, 'Tour package is required'),
  packagePrice: z.number().min(0, 'Package price must be positive'),
  memberCount: z.number().min(1, 'Member count must be at least 1'),
  netCost: z.number().min(0, 'Net cost must be positive'),
  discountType: z.enum(['percentage', 'amount']).optional(),
  discountValue: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  totalCost: z.number().min(0, 'Total cost must be positive'),
  paymentType: z.enum(['ONE_TIME', 'PARTIAL','EMI']),
});

export const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  note: z.string().optional(),
  status: z.enum(['PENDING', 'PAID', 'FAILED']),
});

export type TourMemberFormData = z.infer<typeof tourMemberSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
