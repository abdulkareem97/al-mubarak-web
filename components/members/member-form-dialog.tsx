"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "./file-upload";
import { FileViewer } from "./file-viewer";
import { Member, MemberFormData } from "@/types/member";
import { membersApi } from "@/lib/api/member";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  mobileNo: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid mobile number format"),
  address: z
    .string()
    .min(1, "Address is required")
    .min(3, "Address must be at least 3 characters"),
});

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member | null;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: MemberFormDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const isEdit = !!member;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobileNo: "",
      address: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: membersApi.createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member created successfully");
      onOpenChange(false);
      form.reset();
      setFiles([]);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create member");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; formData: MemberFormData }) =>
      membersApi.updateMember(data.id, data.formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Member updated successfully");
      onOpenChange(false);
      form.reset();
      setFiles([]);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update member");
    },
  });

  useEffect(() => {
    if (member && open) {
      form.reset({
        name: member.name,
        mobileNo: member.mobileNo,
        address: member.address,
      });
      setFiles([]);
    } else if (!open) {
      form.reset();
      setFiles([]);
    }
  }, [member, open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData: MemberFormData = {
      ...values,
      documents: files.length > 0 ? files : undefined,
    };

    if (isEdit && member) {
      updateMutation.mutate({ id: member.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Member" : "Add New Member"}</DialogTitle>
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
                name="mobileNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter complete address"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Documents</h3>
                <span className="text-sm text-muted-foreground">
                  Upload member documents (optional)
                </span>
              </div>

              {isEdit && member?.document && member.document.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Current Documents</h4>
                  <FileViewer
                    documents={member.document}
                    memberName={member.name}
                  />
                  <Separator />
                </div>
              )}

              <FileUpload files={files} onChange={setFiles} multiple={true} />
            </div>

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
                  ? "Update Member"
                  : "Create Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
