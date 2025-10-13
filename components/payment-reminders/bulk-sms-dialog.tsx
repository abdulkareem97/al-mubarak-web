// components/payment-reminders/bulk-sms-dialog.tsx
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Send, Users, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TourMember } from "@/types/payment-reminder";
import { useBulkSms } from "@/hooks/use-payment-reminders";

interface BulkSmsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: TourMember[];
}

const DEFAULT_MESSAGE_TEMPLATES = [
  {
    name: "Payment Reminder",
    message:
      "Dear {name}, this is a friendly reminder that your payment of ₹{amount} for {tourPackage} is pending. Please complete your payment at your earliest convenience. Thank you!",
  },
  {
    name: "Urgent Payment",
    message:
      "Hi {name}, your payment of ₹{amount} for {tourPackage} is overdue. Please make the payment immediately to avoid any inconvenience. Contact us for assistance.",
  },
  {
    name: "Final Notice",
    message:
      "Dear {name}, this is the final notice for your pending payment of ₹{amount} for {tourPackage}. Please settle this amount today to secure your booking.",
  },
];

export function BulkSmsDialog({
  isOpen,
  onClose,
  selectedMembers,
}: BulkSmsDialogProps) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE_TEMPLATES[0].message);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const bulkSmsMutation = useBulkSms();

  const calculateDueAmount = (member: TourMember) => {
    const paidAmount = member.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return member.totalCost - paidAmount;
  };

  const totalDueAmount = selectedMembers.reduce((sum, member) => {
    return sum + calculateDueAmount(member);
  }, 0);

  const handleSendSms = async () => {
    try {
      const payload = {
        memberIds: selectedMembers.map((member) => member.id),
        message,
        scheduleDate,
      };

      await bulkSmsMutation.mutateAsync(payload);

      // Log for now since function should be empty
      console.log(
        "Bulk SMS sent to:",
        selectedMembers.map((member) => ({
          name: member.members[0]?.name,
          phone: member.members[0]?.mobileNo,
          amount: calculateDueAmount(member),
          tourPackage: member.tourPackage.packageName,
        }))
      );

      onClose();
      setMessage(DEFAULT_MESSAGE_TEMPLATES[0].message);
      setScheduleDate(undefined);
      setSelectedTemplate(0);
    } catch (error) {
      console.error("Failed to send bulk SMS:", error);
    }
  };

  const handleTemplateSelect = (index: number) => {
    setSelectedTemplate(index);
    setMessage(DEFAULT_MESSAGE_TEMPLATES[index].message);
  };

  const previewMessage = (member: TourMember) => {
    return message
      .replace("{name}", member.members[0]?.name || "")
      .replace("{amount}", calculateDueAmount(member).toLocaleString())
      .replace("{tourPackage}", member.tourPackage.packageName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Send Bulk SMS
          </DialogTitle>
          <DialogDescription>
            Send payment reminders to {selectedMembers.length} selected members
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Message Composition */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Message Templates</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {DEFAULT_MESSAGE_TEMPLATES.map((template, index) => (
                    <Button
                      key={index}
                      variant={
                        selectedTemplate === index ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTemplateSelect(index)}
                      className="justify-start"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Message Content
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="mt-1"
                />
                <div className="mt-1 text-xs text-muted-foreground">
                  Available placeholders: {"{name}"}, {"{amount}"},{" "}
                  {"{tourPackage}"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Character count: {message.length}/160
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Schedule (Optional)
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !scheduleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? (
                        format(scheduleDate, "PPP 'at' p")
                      ) : (
                        <span>Send immediately</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                    {scheduleDate && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setScheduleDate(undefined)}
                          className="w-full"
                        >
                          Clear Schedule
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Recipients Preview */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">
                  Recipients Summary
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Total Recipients
                      </span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      {selectedMembers.length}
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Due</span>
                    </div>
                    <div className="text-2xl font-bold mt-1">
                      ₹{totalDueAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Message Preview</Label>
                <ScrollArea className="h-[300px] mt-2">
                  <div className="space-y-3">
                    {selectedMembers.slice(0, 5).map((member) => (
                      <div key={member.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {member.members[0]?.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            ₹{calculateDueAmount(member).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          To: {member.members[0]?.mobileNo}
                        </div>
                        <div className="text-sm bg-muted p-2 rounded text-left">
                          {previewMessage(member)}
                        </div>
                      </div>
                    ))}
                    {selectedMembers.length > 5 && (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        ... and {selectedMembers.length - 5} more recipients
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSendSms}
            disabled={!message.trim() || bulkSmsMutation.isPending}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {bulkSmsMutation.isPending
              ? "Sending..."
              : scheduleDate
              ? "Schedule SMS"
              : "Send Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
