// components/tour-packages/tour-package-view.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Edit,
  ArrowLeft,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Share2,
  Plus,
  IndianRupee,
} from "lucide-react";
import { useTourPackage } from "@/hooks/useTourPackages";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { baseURL } from "@/lib/api";
import TourMemberForm from "../tour-memeber/TourMemeberForm";
import { useState } from "react";
import { TourMember } from "@/types/tour-member";
import TourMemberTable from "../tour-memeber/TourMemeberTable";

interface TourPackageViewProps {
  id: string;
}

export function TourPackageView({ id }: TourPackageViewProps) {
  const { data: tourPackage, isLoading, error } = useTourPackage(id);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingTourMember, setEditingTourMember] = useState<
    TourMember | undefined
  >();
  const [selectedTourPackageId, setSelectedTourPackageId] =
    useState<string>("");

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTourMember(undefined);
  };

  const handleAddNew = () => {
    setEditingTourMember(undefined);
    setShowForm(true);
  };

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
        <div className="text-center text-red-600">
          Failed to load tour package
        </div>
      </div>
    );
  }

  const handleEdit = (tourMember: TourMember) => {
    setEditingTourMember(tourMember);
    setSelectedTourPackageId(tourMember.tourPackageId);
    setShowForm(true);
  };

  const totalValue = tourPackage.tourPrice * tourPackage.totalSeat;

  console.log("tourPackage", tourPackage);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{tourPackage.packageName}</h1>
          <p className="text-muted-foreground">Tour Package Details</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button> */}
          <Button
            onClick={() => router.push(`/dashboard/tour-packages/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover Photo */}
          {tourPackage.coverPhoto && tourPackage.coverPhoto !== ".." && (
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={baseURL + "/" + tourPackage.coverPhoto}
                    alt={tourPackage.packageName}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{tourPackage.desc}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ₹ Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Price per person
                </span>
                <span className="font-semibold">
                  ₹ {tourPackage.tourPrice?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total seats
                </span>
                <Badge variant="secondary">
                  <Users className="h-3 w-3 mr-1" />
                  {tourPackage.totalSeat}
                </Badge>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-medium">Total Package Value</span>
                <span className="text-lg font-bold text-primary">
                  ₹{totalValue?.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Package Info */}
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Created:{" "}
                  {new Date(tourPackage.createdAt || "")?.toLocaleDateString()}
                </span>
              </div>

              {tourPackage.updatedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Updated:{" "}
                    {new Date(tourPackage.updatedAt)?.toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/dashboard/tour-packages/${id}/bookings`)
                }
              >
                View Bookings
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/dashboard/tour-packages/${id}/duplicate`)
                }
              >
                Duplicate Package
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="h-8 w-8" />
              Tour Members
            </h1>
            <p className="text-muted-foreground">
              Manage tour bookings, members, and payments
            </p>
          </div>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Tour Members
          </Button>
        </div>
      </div>

      <TourMemberForm
        open={showForm}
        onOpenChange={setShowForm}
        tourPackage={tourPackage}
        tourMember={editingTourMember}
        onSuccess={handleFormSuccess}
      />
      <TourMemberTable onEdit={handleEdit} tourPackageId={id} />
    </div>
  );
}
