// components/enquiries/enquiry-form-dialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EnquiryForm,
  EnquiryFormData,
  EnquiryFormStatus,
} from "@/types/enquiry";
import { enquiriesApi } from "@/lib/api/enquiry";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
  purpose: z
    .string()
    .min(1, "Purpose is required")
    .min(10, "Purpose must be at least 10 characters"),
  status: z.nativeEnum(EnquiryFormStatus).optional(),
});

interface EnquiryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiry?: EnquiryForm | null;
}

export function EnquiryFormDialog({
  open,
  onOpenChange,
  enquiry,
}: EnquiryFormDialogProps) {
  const queryClient = useQueryClient();
  const isEdit = !!enquiry;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      purpose: "",
      status: EnquiryFormStatus.PENDING,
    },
  });

  const createMutation = useMutation({
    mutationFn: enquiriesApi.createEnquiry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry created successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create enquiry");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; formData: EnquiryFormData }) =>
      enquiriesApi.updateEnquiry(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Enquiry updated successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update enquiry");
    },
  });

  useEffect(() => {
    if (enquiry && open) {
      form.reset({
        name: enquiry.name,
        phone: enquiry.phone,
        purpose: enquiry.purpose,
        status: enquiry.status,
      });
    } else if (!open) {
      form.reset();
    }
  }, [enquiry, open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData: EnquiryFormData = {
      name: values.name,
      phone: values.phone,
      purpose: values.purpose,
      status: values.status,
    };

    if (isEdit && enquiry) {
      updateMutation.mutate({ id: enquiry.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Enquiry" : "Add New Enquiry"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter enquiry purpose or details"
                      className="h-[220px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={EnquiryFormStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={EnquiryFormStatus.BOOKED}>
                          Booked
                        </SelectItem>
                        <SelectItem value={EnquiryFormStatus.NOT_INTERESTED}>
                          Not Interested
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEdit
                  ? "Update Enquiry"
                  : "Create Enquiry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
