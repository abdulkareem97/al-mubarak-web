// components/payment-reminders/error-state.tsx
import { AlertTriangle, RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  title?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = "Something went wrong",
}: ErrorStateProps) {
  const getErrorMessage = (error: Error) => {
    if (error.message.includes("Network Error")) {
      return "Please check your internet connection and try again.";
    }
    if (error.message.includes("404")) {
      return "The requested data could not be found.";
    }
    if (error.message.includes("403") || error.message.includes("401")) {
      return "You don't have permission to access this data.";
    }
    if (error.message.includes("500")) {
      return "Server error. Please try again later.";
    }
    return error.message || "An unexpected error occurred.";
  };

  const getErrorIcon = (error: Error) => {
    if (error.message.includes("Network Error")) {
      return <Wifi className="h-12 w-12 text-muted-foreground" />;
    }
    return <AlertTriangle className="h-12 w-12 text-destructive" />;
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="pt-8 pb-8 text-center space-y-4">
        {getErrorIcon(error)}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
