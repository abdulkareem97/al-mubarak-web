// app/dashboard/tour-packages/[id]/page.tsx
"use client";
import { TourPackageView } from "@/components/tour-packages/tour-package-view";
import React from "react";

interface TourPackagePageProps {
  params: {
    id: string;
  };
}
export default function TourPackagePage({ params }: TourPackagePageProps) {
  const { id }: any = React.use(params as any);
  return <TourPackageView id={id} />;
}
