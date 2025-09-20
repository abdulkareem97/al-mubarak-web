// components/payment-reminders/empty-state.tsx
import { MessageSquare, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  type?: "no-data" | "no-results" | "no-selection";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  type = "no-data",
  onAction,
  actionLabel,
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "no-results":
        return {
          icon: <Search className="h-12 w-12 text-muted-foreground" />,
          title: "No members found",
          description: "Try adjusting your filters to see more results.",
          action: { label: "Clear Filters", handler: onAction },
        };
      case "no-selection":
        return {
          icon: <MessageSquare className="h-12 w-12 text-muted-foreground" />,
          title: "No members selected",
          description:
            "Select members from the table to send bulk SMS reminders.",
          action: null,
        };
      default:
        return {
          icon: <Users className="h-12 w-12 text-muted-foreground" />,
          title: "No pending payments",
          description: "All members have completed their payments! 🎉",
          action: null,
        };
    }
  };

  const content = getContent();

  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        {content.icon}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{content.title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {content.description}
          </p>
        </div>
        {content.action && (
          <Button variant="outline" onClick={content.action.handler}>
            {actionLabel || content.action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
