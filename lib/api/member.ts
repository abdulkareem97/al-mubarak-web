import { MemberFormData } from "@/types/member";
import api from "../api";


export const membersApi = {
  // Get all members with pagination
  getMembers: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/members`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  // Get single member
  getMember: async (id: string) => {
    const response = await api.get(`/api/members/${id}`);
    return response.data;
  },

  // Create member
  createMember: async (data: MemberFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("mobileNo", data.mobileNo);
    formData.append("address", data.address);

    if (data.documents) {
      data.documents.forEach((file) => {
        formData.append("document", file);
      });
    }

    const response = await api.post(`/members`, formData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
    return response.data;
  },

  // Update member
  updateMember: async (id: string, data: MemberFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("mobileNo", data.mobileNo);
    formData.append("address", data.address);

    if (data.documents) {
      data.documents.forEach((file) => {
        formData.append("document", file);
      });
    }

    const response = await api.put(`/members/${id}`, formData);
    return response.data;
  },

  // Delete member
  deleteMember: async (id: string) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};
