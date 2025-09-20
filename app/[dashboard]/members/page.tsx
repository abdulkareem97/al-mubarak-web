"use client";
import { MembersTable } from "@/components/members/members-table";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="container mx-auto py-6 px-4">
        <MembersTable />
      </div>
    </div>
  );
};

export default page;
