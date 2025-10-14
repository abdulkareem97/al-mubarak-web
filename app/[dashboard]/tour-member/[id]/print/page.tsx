"use client";
import TourBillPrint from "@/components/tour-memeber/PaymentPrint";
import SinglePaymentPrint from "@/components/tour-memeber/SinglePaymentPrint";
import { useSearchParams } from "next/navigation";
import React from "react";

const page = ({ params }: any) => {
  const { id }: any = React.use(params as any);
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  return (
    <div>
      {paymentId ? (
        <SinglePaymentPrint tourMemberId={id} paymentId={paymentId} />
      ) : (
        <TourBillPrint tourMemberId={id} />
      )}
    </div>
  );
};

export default page;
