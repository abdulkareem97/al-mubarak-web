
// utils/tour-package-utils.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const getPackageStatus = (tourPackage: any) => {
  // Add your business logic for package status
  return 'Active'; // Default status
};

export const calculatePackageMetrics = (packages: any[]) => {
  return {
    totalPackages: packages.length,
    totalSeats: packages.reduce((sum, pkg) => sum + pkg.totalSeat, 0),
    totalValue: packages.reduce((sum, pkg) => sum + (pkg.tourPrice * pkg.totalSeat), 0),
    averagePrice: packages.length > 0 ? 
      packages.reduce((sum, pkg) => sum + pkg.tourPrice, 0) / packages.length : 0,
  };
};