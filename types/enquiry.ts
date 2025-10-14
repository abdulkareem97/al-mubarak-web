// types/enquiry.ts

export enum EnquiryFormStatus {
  PENDING = "PENDING",
  BOOKED = "BOOKED",
  NOT_INTERESTED = "NOT_INTERESTED",
}

export interface EnquiryForm {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  status: EnquiryFormStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryFormData {
  name: string;
  phone: string;
  purpose: string;
  status?: EnquiryFormStatus;
}

export interface EnquiryFormsResponse {
  data: EnquiryForm[];
  total: number;
  page: number;
  limit: number;
}