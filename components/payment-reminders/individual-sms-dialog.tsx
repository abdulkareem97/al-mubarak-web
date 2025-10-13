// components/payment-reminders/individual-sms-dialog.tsx
import { useState } from "react";
import { Send, MessageSquare, Phone, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TourMember } from "@/types/payment-reminder";
import { useIndividualSms } from "@/hooks/use-payment-reminders";

interface IndividualSmsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TourMember | null;
}

const QUICK_TEMPLATES = [
  "Payment reminder for your upcoming tour. Please complete your payment.",
  "Your tour payment is overdue. Please make the payment immediately.",
  "Final notice: Please complete your tour payment today.",
  "Thank you for your partial payment. Remaining amount is due soon.",
];

export function IndividualSmsDialog({
  isOpen,
  onClose,
  member,
}: IndividualSmsDialogProps) {
  const [message, setMessage] = useState("");
  const individualSmsMutation = useIndividualSms();

  const calculateDueAmount = (member: TourMember) => {
    const paidAmount = member.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return member.totalCost - paidAmount;
  };

  const handleSendSms = async () => {
    if (!member || !message.trim()) return;

    try {
      await individualSmsMutation.mutateAsync({
        memberId: member.id,
        message,
      });

      // Log for now since function should be empty
      console.log("Individual SMS sent to:", {
        name: member.members[0]?.name,
        phone: member.members[0]?.mobileNo,
        message,
        amount: calculateDueAmount(member),
      });

      onClose();
      setMessage("");
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  };

  const handleTemplateClick = (template: string) => {
    setMessage(template);
  };

  if (!member) return null;

  const primaryMember = member.members[0];
  const dueAmount = calculateDueAmount(member);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send SMS Reminder
          </DialogTitle>
          <DialogDescription>
            Send a payment reminder to {primaryMember?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-auto">
          {/* Member Information */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{primaryMember?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{primaryMember?.mobileNo}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Due:{" "}
                    <span className="font-medium text-destructive">
                      ₹{dueAmount.toLocaleString()}
                    </span>
                  </span>
                </div>
                <Badge variant="outline">
                  {member.tourPackage.packageName}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quick Templates */}
          <div>
            <Label className="text-sm font-medium">Quick Templates</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {QUICK_TEMPLATES.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateClick(template)}
                  className="justify-start text-left h-auto p-3"
                >
                  <div className="text-xs text-muted-foreground truncate">
                    {template}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Message Input */}
          <div>
            <Label htmlFor="sms-message" className="text-sm font-medium">
              Message Content
            </Label>
            <Textarea
              id="sms-message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
            />
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground">
                Character count: {message.length}/160
              </div>
              {message.length > 160 && (
                <div className="text-xs text-amber-600">
                  Message will be sent as multiple SMS
                </div>
              )}
            </div>
          </div>

          {/* Message Preview */}
          {message.trim() && (
            <div>
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-1 p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  To: {primaryMember?.mobileNo}
                </div>
                <div className="text-sm">{message}</div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendSms}
            disabled={!message.trim() || individualSmsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {individualSmsMutation.isPending ? "Sending..." : "Send SMS"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
