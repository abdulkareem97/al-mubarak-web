// components/tour-packages/tour-package-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TourPackage, TourPackageFormData } from "@/types/tour-package";
import {
  useCreateTourPackage,
  useUpdateTourPackage,
} from "@/hooks/useTourPackages";
import { useRouter } from "next/navigation";
import { Loader2, Calculator } from "lucide-react";
import { FileUpload } from "../members/file-upload";
import { baseURL } from "@/lib/api";

const formSchema = z.object({
  packageName: z.string().min(1, "Package name is required"),
  tourPrice: z.number().min(0, "Tour price must be positive"),
  totalSeat: z.number().min(1, "Total seats must be at least 1"),
  desc: z.string().min(1, "Description is required"),
  coverPhoto: z.union([z.instanceof(File), z.string()]).optional(),
});

interface TourPackageFormProps {
  tourPackage?: TourPackage;
  onSuccess?: () => void;
}

export function TourPackageForm({
  tourPackage,
  onSuccess,
}: TourPackageFormProps) {
  const [coverPhoto, setCoverPhoto] = useState<File[] | null>([]);
  const router = useRouter();

  const createMutation = useCreateTourPackage();
  const updateMutation = useUpdateTourPackage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageName: tourPackage?.packageName || "",
      tourPrice: tourPackage?.tourPrice || 0,
      totalSeat: tourPackage?.totalSeat || 1,
      desc: tourPackage?.desc || "",
    },
  });

  const tourPrice = form.watch("tourPrice");
  const totalSeat = form.watch("totalSeat");
  const totalPrice = tourPrice * totalSeat;

  useEffect(() => {
    const fetchFile = async () => {
      if (tourPackage?.coverPhoto) {
        const res = await fetch(`${baseURL}/${tourPackage.coverPhoto}`);
        const blob = await res.blob();
        const file = new File([blob], "coverPhoto.jpg", { type: blob.type });
        setCoverPhoto([file]);
      }
    };
    fetchFile();
  }, [tourPackage]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData: TourPackageFormData = {
        ...values,
        coverPhoto: coverPhoto[0] || undefined,
      };

      if (tourPackage) {
        await updateMutation.mutateAsync({
          id: tourPackage.id,
          data: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard/tour-packages");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {tourPackage ? "Edit Tour Package" : "Create Tour Package"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="packageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter package name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tourPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Price (per person)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Seats</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Price Display */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Total Package Value: ₹{totalPrice.toFixed(2)}
              </span>
            </div>

            <FormItem>
              <FormLabel>Cover Photo</FormLabel>
              <FileUpload
                files={coverPhoto}
                onChange={setCoverPhoto}
                multiple={false}
              />
            </FormItem>

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tour package description..."
                      rows={8}
                      className="h-40"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tourPackage ? "Update Package" : "Create Package"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
