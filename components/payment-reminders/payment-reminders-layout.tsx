// components/payment-reminders/payment-reminders-layout.tsx
import { Suspense } from "react";
import { PaymentRemindersLoadingSkeleton } from "./loading-skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorState } from "./error-state";

interface PaymentRemindersLayoutProps {
  children: React.ReactNode;
}

export function PaymentRemindersLayout({
  children,
}: PaymentRemindersLayoutProps) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="container mx-auto p-6">
          <ErrorState
            error={error}
            onRetry={resetErrorBoundary}
            title="Failed to load payment reminders"
          />
        </div>
      )}
      onReset={() => {
        // Optionally clear any cached data or reload the page
        window.location.reload();
      }}
    >
      <Suspense fallback={<PaymentRemindersLoadingSkeleton />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
