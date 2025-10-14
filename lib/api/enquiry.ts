// lib/api/enquiry.ts
import { EnquiryFormData, EnquiryFormStatus } from "@/types/enquiry";
import api from "../api";

export const enquiriesApi = {
  // Get all enquiries with pagination
  getEnquiries: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/enquiries`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get single enquiry
  getEnquiry: async (id: string) => {
    const response = await api.get(`/enquiries/${id}`);
    return response.data;
  },

  // Create enquiry
  createEnquiry: async (data: EnquiryFormData) => {
    const response = await api.post(`/enquiries`, data);
    return response.data;
  },

  // Update enquiry
  updateEnquiry: async (id: string, data: EnquiryFormData) => {
    const response = await api.put(`/enquiries/${id}`, data);
    return response.data;
  },

  // Update enquiry status
  updateEnquiryStatus: async (id: string, status: EnquiryFormStatus) => {
    const response = await api.patch(`/enquiries/${id}/status`, { status });
    return response.data;
  },

  // Delete enquiry
  deleteEnquiry: async (id: string) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  },
};