
// hooks/use-payment-reminder-filters.ts
import { useState, useMemo } from "react";
import { useDebounce } from "./use-debounce";
import { useLocalStorage } from "./use-local-storage";
import { PaymentReminderFilters, PaymentStatus } from "@/types/payment-reminder";

const DEFAULT_FILTERS: PaymentReminderFilters = {
  search: "",
  tourPackageId: "",
  paymentStatus: "" as PaymentStatus | "",
  paymentType: "",
  dateRange: {
    from: undefined,
    to: undefined,
  },
};

export function usePaymentReminderFilters() {
  const [filters, setFilters] = useLocalStorage("payment-reminder-filters", DEFAULT_FILTERS);
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 300);
  
  // Memoized filters with debounced search
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
  }), [filters, debouncedSearch]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const updateFilter = <K extends keyof PaymentReminderFilters>(
    key: K, 
    value: PaymentReminderFilters[K]
  ) => {

    console.log("updating filter", key, value);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search || 
      filters.tourPackageId || 
      filters.paymentStatus || 
      filters.paymentType || 
      filters.dateRange.from || 
      filters.dateRange.to
    );
  }, [filters]);

  return {
    filters,
    debouncedFilters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    setFilters,
  };
}