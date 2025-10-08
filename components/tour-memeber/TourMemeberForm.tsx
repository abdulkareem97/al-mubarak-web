// File: /components/tour-members/TourMemberForm.tsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Plus,
  Calculator,
  Users,
  IndianRupee,
  Percent,
  CreditCard,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import {
  tourMemberSchema,
  type TourMemberFormData,
} from "@/validation/tour-memeber";
import {
  memberApi,
  tourPackageApi,
  tourMemberApi,
} from "@/lib/api/tour-memeber";
import { Member } from "@/types/member";
import { TourMember, TourPackage } from "@/types/tour-member";
import { MemberFormDialog } from "../members/member-form-dialog";
import TourPackageSearchForm from "./TourPackageSearchForm";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member | null;
}

interface TourMemberFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourPackage?: TourPackage;
  tourMember?: TourMember | null;
  onSuccess?: () => void;
}

const TourMemberForm: React.FC<TourMemberFormProps> = ({
  open,
  onOpenChange,
  tourPackage,
  tourMember,
  onSuccess,
}) => {
  console.log("tourpackage in memeber", tourPackage);

  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "percentage"
  );

  const [selectedTourPackage, setSelectedTourPackage] =
    useState<TourPackage | null>(tourPackage);
  const queryClient = useQueryClient();

  // Fetch data
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: memberApi.getAll,
    enabled: open,
  });

  // const { data: tourPackage, isLoading: packageLoading } = useQuery({
  //   queryKey: ["tourPackage", tourPackageId],
  //   queryFn: () => tourPackageApi.getById(tourPackageId),
  //   enabled: open && !!tourPackageId,
  // });

  // Form setup
  const form = useForm<TourMemberFormData>({
    resolver: zodResolver(tourMemberSchema),
  });

  const { watch, setValue, handleSubmit, reset } = form;
  const watchedFields = watch();

  // Auto-calculate values
  // useEffect(() => {
  //   console.log("tour package", tourPackage);
  //   if (tourPackage) {
  //     setValue("packagePrice", tourPackage.tourPrice);
  //     console.log("pakcage price for tour", tourPackage.tourPrice);
  //   }
  // }, [setValue, open]);

  useEffect(() => {
    const memberCount = watchedFields.memberIds?.length || 0;
    setValue("memberCount", memberCount);

    console.log(
      "package price",
      watchedFields.packagePrice,
      watchedFields.memberIds
    );
    const netCost = (watchedFields.packagePrice || 0) * memberCount;
    setValue("netCost", netCost);

    // Calculate discount
    let discountAmount = 0;
    if (watchedFields.discountValue) {
      if (discountType === "percentage") {
        discountAmount = (netCost * watchedFields.discountValue) / 100;
      } else {
        discountAmount = watchedFields.discountValue;
      }
    }
    setValue("discount", discountAmount);

    const totalCost = netCost - discountAmount;
    setValue("totalCost", Math.max(0, totalCost));
  }, [
    watchedFields.memberIds,
    watchedFields.packagePrice,
    watchedFields.discountValue,
    discountType,
    setValue,
  ]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      let formData = {
        memberIds:
          JSON.parse((tourMember?.memberIds as unknown as string) || "[]") ||
          [],
        tourPackageId: selectedTourPackage?.id || "",
        packagePrice:
          tourMember?.packagePrice || selectedTourPackage?.tourPrice || 0,
        memberCount: tourMember?.memberCount || 0,
        netCost: tourMember?.netCost || selectedTourPackage?.tourPrice || 0,
        discountValue: 0,
        discount: tourMember?.discount || 0,
        totalCost: tourMember?.totalCost || 0,
        paymentType: tourMember?.paymentType || "ONE_TIME",
      };
      reset(formData);

      console.log("resetting form", formData);
    }
  }, [open, tourMember, selectedTourPackage, reset]);

  // Handle discount type change
  const handleDiscountTypeChange = (type: "percentage" | "amount") => {
    setDiscountType(type);
    setValue("discountValue", 0);
  };

  // Mutations
  const createTourMember = useMutation({
    mutationFn: tourMemberApi.create,
    onSuccess: () => {
      toast.success("Tour member created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tourMembers"] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create tour member");
    },
  });

  const updateTourMember = useMutation({
    mutationFn: (data: TourMemberFormData) =>
      tourMemberApi.update(tourMember!.id, data),
    onSuccess: () => {
      toast.success("Tour member updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tourMembers"] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update tour member");
    },
  });

  const onSubmit = (data: TourMemberFormData) => {
    const payload = {
      ...data,
      memberIds: data.memberIds,
    };

    if (tourMember) {
      updateTourMember.mutate(payload);
    } else {
      createTourMember.mutate(payload);
    }
  };

  const selectedMembers = members?.filter((member) =>
    watchedFields.memberIds?.includes(member.id)
  );

  if (membersLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Loading Data</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className=" max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6" />
              {tourMember ? "Edit" : "Add"} Tour Members
            </DialogTitle>
          </DialogHeader>
          {!tourPackage && (
            <TourPackageSearchForm
              setSelectedTourPackage={setSelectedTourPackage}
            />
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Left Column - Member Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Select Members
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMemberDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add New
                      </Button>
                    </CardTitle>
                    <CardDescription>
                      Choose members for this tour package
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="memberIds"
                      render={() => (
                        <FormItem>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {members?.map((member) => (
                              <FormField
                                key={member.id}
                                control={form.control}
                                name="memberIds"
                                render={({ field }) => (
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          member.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const updatedValue = checked
                                            ? [
                                                ...(field.value || []),
                                                member.id,
                                              ]
                                            : field.value?.filter(
                                                (id) => id !== member.id
                                              ) || [];
                                          field.onChange(updatedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <FormLabel className="font-medium cursor-pointer">
                                          {member.name}
                                        </FormLabel>
                                      </div>
                                      <div className="text-sm text-muted-foreground space-y-1">
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {member.mobileNo}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          <span className="truncate">
                                            {member.address}
                                          </span>
                                        </div>
                                        {member.document && (
                                          <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            <span className="text-xs">
                                              {Object.keys(
                                                member.document
                                              ).join(", ")}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Right Column - Cost Calculation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Cost Calculation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tour Package Info */}
                    {selectedTourPackage && (
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="font-medium">
                          {selectedTourPackage.packageName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{selectedTourPackage.tourPrice.toLocaleString()} per
                          person
                        </div>
                      </div>
                    )}

                    {/* Member Count */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">
                        Members Selected
                      </span>
                      <Badge variant="secondary">
                        {watchedFields.memberCount || 0}
                      </Badge>
                    </div>

                    {/* Net Cost */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="text-sm font-medium">Net Cost</span>
                      <span className="font-mono">
                        ₹{(watchedFields.netCost || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Discount Section */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Discount</Label>
                      <RadioGroup
                        value={discountType}
                        onValueChange={(value) =>
                          handleDiscountTypeChange(
                            value as "percentage" | "amount"
                          )
                        }
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="percentage" id="percentage" />
                          <Label htmlFor="percentage" className="text-sm">
                            Percentage
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="amount" id="amount" />
                          <Label htmlFor="amount" className="text-sm">
                            Amount
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="discountValue"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="pr-8"
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    {discountType === "percentage" ? (
                                      <Percent className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <>₹</>
                                    )}
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {(watchedFields.discount || 0) > 0 && (
                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-sm font-medium text-red-700">
                            Discount Applied
                          </span>
                          <span className="font-mono text-red-700">
                            -₹{(watchedFields.discount || 0).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Total Cost */}
                    <div className="flex items-center justify-between p-4 bg-primary/5 border-2 border-primary rounded-lg">
                      <span className="text-lg font-semibold">Total Cost</span>
                      <span className="text-xl font-bold font-mono text-primary">
                        ₹{(watchedFields.totalCost || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Payment Type */}
                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ONE_TIME">
                                Full Payment
                              </SelectItem>
                              <SelectItem value="PARTIAL">
                                Partial Payment
                              </SelectItem>
                              <SelectItem value="EMI">EMI</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Selected Members Preview */}
              {selectedMembers?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Selected Members ({selectedMembers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {member.mobileNo}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{member.address}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createTourMember.isPending || updateTourMember.isPending
                  }
                  className="min-w-[100px]"
                >
                  {createTourMember.isPending || updateTourMember.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : tourMember ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Member Form Dialog */}
      <MemberFormDialog
        open={showMemberDialog}
        onOpenChange={setShowMemberDialog}
      />
    </>
  );
};

export default TourMemberForm;
