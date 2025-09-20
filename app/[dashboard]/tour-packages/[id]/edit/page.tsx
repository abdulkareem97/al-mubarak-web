"use client";

import { TourPackageForm } from "@/components/tour-packages/tour-package-form";
import { useTourPackage } from "@/hooks/useTourPackages";
import { useRouter } from "next/navigation";
import React from "react";

interface EditTourPackagePageProps {
  params: {
    id: string;
  };
}

export default function EditTourPackagePage({
  params,
}: EditTourPackagePageProps) {
  const { id }: any = React.use(params as any);
  const { data: tourPackage, isLoading, error } = useTourPackage(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !tourPackage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Tour package not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TourPackageForm
        tourPackage={tourPackage}
        onSuccess={() => router.push(`/dashboard/tour-packages/${params.id}`)}
      />
    </div>
  );
}
