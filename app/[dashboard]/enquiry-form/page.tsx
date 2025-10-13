// File: /pages/tour-members/index.tsx or /app/tour-members/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

import { TourMember } from "@/types/tour-member";
import TourMemberTable from "@/components/tour-memeber/TourMemeberTable";
import TourMemberForm from "@/components/tour-memeber/TourMemeberForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tourMemberApi } from "@/lib/api/tour-memeber";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

const page: React.FC = () => {
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

  const updateTourMember = useMutation({
    mutationFn: (tourMemberId: string) =>
      tourMemberApi.update(tourMemberId, { status: "BOOKED" }),
    onSuccess: () => {
      toast.success("Tour member updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tourMembers", "ENQUIRY"] });
    },
    onError: () => {
      toast.error("Failed to update tour member");
    },
  });

  const handleUpdate = (tourMember: TourMember) => {
    updateTourMember.mutate(tourMember.id);
  };
  // const handleUpdate = (tourMemberId)

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
            Enquiry Form
          </h1>
          <p className="text-muted-foreground">Manage tour enquiry form</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Enquiry Form
        </Button>
      </div>

      {/* Table */}
      <TourMemberTable onEdit={handleUpdate} status={"ENQUIRY"} />

      {/* Form Dialog */}
      <TourMemberForm
        open={showForm}
        onOpenChange={setShowForm}
        // tourPackageId={selectedTourPackageId}
        tourMember={editingTourMember}
        onSuccess={handleFormSuccess}
        status={"ENQUIRY"}
      />
    </div>
  );
};

export default page;
