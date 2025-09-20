// File: /pages/tour-members/index.tsx or /app/tour-members/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

import { TourMember } from "@/types/tour-member";
import TourMemberTable from "@/components/tour-memeber/TourMemeberTable";
import TourMemberForm from "@/components/tour-memeber/TourMemeberForm";
import { useQuery } from "@tanstack/react-query";
import { tourMemberApi } from "@/lib/api/tour-memeber";

const TourMemberManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTourMember, setEditingTourMember] = useState<
    TourMember | undefined
  >();
  const [selectedTourPackageId, setSelectedTourPackageId] =
    useState<string>("");

  const handleAddNew = () => {
    setEditingTourMember(undefined);
    setSelectedTourPackageId("tour1"); // You can make this dynamic
    setShowForm(true);
  };

  const handleEdit = (tourMember: TourMember) => {
    setEditingTourMember(tourMember);
    setSelectedTourPackageId(tourMember.tourPackageId);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTourMember(undefined);
  };

  const { data: tourMembersStats, isLoading } = useQuery({
    queryKey: ["tour-members-stats"],
    queryFn: () => tourMemberApi.getTourMembersStats(null),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="text-2xl font-bold">
                {tourMembersStats?.totalBookings}
              </p>
            </div>
            <Users className="ml-auto h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Payments
              </p>
              <p className="text-2xl font-bold">
                {tourMembersStats?.pendingPayments}
              </p>
            </div>
            <div className="ml-auto h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">
                ₹{tourMembersStats?.totalRevenue}
              </p>
            </div>
            <div className="ml-auto h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600">₹</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tours</p>
              <p className="text-2xl font-bold">
                {tourMembersStats?.totalActiveTours}
              </p>
            </div>
            <div className="ml-auto h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600">🏖️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <TourMemberTable onEdit={handleEdit} />

      {/* Form Dialog */}
      <TourMemberForm
        open={showForm}
        onOpenChange={setShowForm}
        // tourPackageId={selectedTourPackageId}
        tourMember={editingTourMember}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default TourMemberManagement;
