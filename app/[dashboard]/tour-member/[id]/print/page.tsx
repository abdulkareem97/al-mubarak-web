"use client";
import TourBillPrint from "@/components/tour-memeber/PaymentPrint";
import React from "react";

const page = ({ params }: any) => {
  const { id }: any = React.use(params as any);
  return (
    <div>
      <TourBillPrint tourMemberId={id} />
    </div>
  );
};

export default page;
