import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logoUrl from "../../public/images/al_mubarak.jpg";
import { useQuery } from "@tanstack/react-query";
import { tourMemberApi } from "@/lib/api/tour-memeber";

interface TourBillPrintProps {
  tourMemberId: string;
  paymentId?: string;
}

const TourBillPrint: React.FC<TourBillPrintProps> = ({
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

  console.log("tourMember", tourMember);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!billRef.current) return;
    try {
      const canvas = await html2canvas(billRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // A4: 210mm × 297mm
      const imgWidth = 210;
      const imgHeight = 297;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`tour-bill-${tourMember.id}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

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

  const totalPaid =
    tourMember?.payments.reduce(
      (sum, payment) =>
        payment.status === "PAID" ? sum + payment.amount : sum,
      0
    ) || 0;

  const balance = (tourMember?.totalCost || 0) - totalPaid;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

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
        {/* <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Download PDF
        </button> */}
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
              <h1 className="text-3xl font-bold text-black">TOUR INVOICE</h1>
              <p className="text-sm text-gray-600">
                #{tourMember.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* INQUIRY FORM */}
        {tourMember.status == "ENQUIRY" && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">Enquiry Form</h2>
          </div>
        )}

        {/* Tour Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black mb-2">
            {tourMember.tourPackage.packageName}
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">
                {tourMember.status == "ENQUIRY" ? "Enquiry" : "Booking"} Date:
              </span>
              <span className="ml-2 font-medium">
                {formatDate(tourMember.createdAt)}
              </span>
            </div>
            {tourMember.status != "ENQUIRY" && (
              <div>
                <span className="text-gray-600">Payment Status:</span>
                <span
                  className={`ml-2 font-medium ${
                    tourMember.paymentStatus === "PAID"
                      ? "text-green-600"
                      : tourMember.paymentStatus === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {tourMember.paymentStatus}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="mb-6">
          <h3 className="font-bold text-black mb-2 border-b border-gray-300 pb-1">
            Tour Members ({tourMember.memberCount})
          </h3>
          <div className="space-y-2">
            {tourMember.members.map((member, idx) => (
              <div key={member.id} className="text-sm flex justify-between">
                <span>
                  {idx + 1}. {member.name}
                </span>
                <span className="text-gray-600">{member.mobileNo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <h3 className="font-bold text-black mb-2 border-b border-gray-300 pb-1">
            Pricing Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package Price (per person)</span>
              <span>{formatCurrency(tourMember.packagePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Members</span>
              <span>× {tourMember.memberCount}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Net Cost</span>
              <span>{formatCurrency(tourMember.netCost)}</span>
            </div>
            {tourMember.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {formatCurrency(tourMember.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
              <span>Total Cost</span>
              <span>{formatCurrency(tourMember.totalCost)}</span>
            </div>
          </div>
        </div>

        {/* Payments */}
        {tourMember.status === "BOOKED" && (
          <div className="mb-6">
            <h3 className="font-bold text-black mb-2 border-b border-gray-300 pb-1">
              Payment History
            </h3>
            {tourMember.payments.length > 0 ? (
              <div className="space-y-2">
                {tourMember.payments.map((payment) => (
                  <div key={payment.id} className="text-sm border-l-2 pl-2">
                    <div className="flex justify-between font-medium">
                      <span>{formatDate(payment.paymentDate)}</span>
                      <span>{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-xs">
                      <span>{payment.paymentMethod}</span>
                      <span>{payment.status}</span>
                    </div>
                    {payment.note && (
                      <p className="text-xs text-gray-500 mt-1">
                        {payment.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No payments recorded yet
              </p>
            )}
          </div>
        )}

        {/* Summary */}
        {tourMember.status == "BOOKED" && (
          <div className="border-t-2 border-gray-800 pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-medium">
                  {formatCurrency(tourMember.totalCost)}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Amount Paid</span>
                <span className="font-medium">{formatCurrency(totalPaid)}</span>
              </div>
              <div
                className={`flex justify-between text-lg font-bold ${
                  balance > 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                <span>{balance > 0 ? "Balance Due" : "Fully Paid"}</span>
                <span>{formatCurrency(Math.abs(balance))}</span>
              </div>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-600">
          <p>Thank you for choosing our tour package!</p>
          <p className="mt-1">For queries, please contact us.</p>
        </div>
      </div>

      {/* Print CSS */}
      <style>{`
  @media print {

    /* Hide everything except invoice */
    body * {
      visibility: hidden;
    }

    .print-area, .print-area * {
      visibility: visible;
    }

    /* Force full A4 size */
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

    /* Remove Modal, Scrollbars, Backgrounds */
    .modal, .dialog, .print:hidden {
      display: none !important;
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

export default TourBillPrint;
