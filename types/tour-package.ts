// types/tour-package.ts
export interface TourPackage {
  id: string;
  packageName: string;
  tourPrice: number;
  totalSeat: number;
  coverPhoto?: string;
  desc: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TourPackageFormData {
  packageName: string;
  tourPrice: number;
  totalSeat: number;
  coverPhoto?: File | string;
  desc: string;
}