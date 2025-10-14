import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logoUrl from "../../public/images/al_mubarak.jpg";
import { useQuery } from "@tanstack/react-query";
import { tourMemberApi } from "@/lib/api/tour-memeber";

interface SinglePaymentPrintProps {
  tourMemberId: string;
  paymentId?: string;
}

const SinglePaymentPrint: React.FC<SinglePaymentPrintProps> = ({
  tourMemberId,
  paymentId,
}) => {
  const billRef = useRef<HTMLDivElement>(null);

  const {
    data: tourMember,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tourMemberById", tourMemberId],
    queryFn: () => tourMemberApi.getById(tourMemberId),
    staleTime: 0,
  });

  const handlePrint = () => window.print();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  // ✅ Get only this payment
  const payment = tourMember?.payments?.find((p) => p.id === paymentId);
  if (!payment) return <div>No payment found</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      {/* Action Buttons */}
      <div className="max-w-3xl mx-auto mb-4 flex gap-2 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Print
        </button>
      </div>

      {/* A4 Container */}
      <div
        ref={billRef}
        className="bg-white mx-auto shadow-lg print-area"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "15mm",
        }}
      >
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <img src={logoUrl.src} alt="Logo" className="h-20" />
            <div className="text-right">
              <h1 className="text-3xl font-bold text-black">PAYMENT RECEIPT</h1>
              <p className="text-sm text-gray-600">
                #{payment.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Member & Package Info */}
        <div className="mb-6 text-sm">
          <h2 className="text-xl font-bold mb-2 text-black">
            {tourMember.tourPackage.packageName}
          </h2>
          <p>
            <span className="font-medium">Member:</span>{" "}
            {tourMember.members[0]?.name}
          </p>
          <p>
            <span className="font-medium">Mobile:</span>{" "}
            {tourMember.members[0]?.mobileNo}
          </p>
        </div>

        {/* Payment Details */}
        <div className="mb-6">
          <h3 className="font-bold text-black mb-2 border-b border-gray-300 pb-1">
            Payment Details
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {formatDate(payment.paymentDate)}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{" "}
              {formatCurrency(payment.amount)}
            </p>
            <p>
              <span className="font-medium">Method:</span>{" "}
              {payment.paymentMethod}
            </p>
            {/* <p>
              <span className="font-medium">Status:</span> {payment.status}
            </p> */}
            {payment.note && (
              <p>
                <span className="font-medium">Note:</span> {payment.note}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for your payment!</p>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0;
            padding: 15mm;
            box-shadow: none;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SinglePaymentPrint;
