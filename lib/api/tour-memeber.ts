// File: /lib/api/tour-members.ts

import { Payment, TourMember, TourMemberStats } from '@/types/tour-member';
import api from '../api';
import { Member } from '@/types/member';
import { TourPackage } from '@/types/tour-package';

export const tourMemberApi = {
  getAll: (tourPackageId?: string): Promise<TourMember[]> => 
    api.get('/tour-members', { params: { tourPackageId } }).then(res => res.data.data.data),
  
  getById: (id: string): Promise<TourMember> => 
    api.get(`/tour-members/${id}`).then(res => res.data.data),
  
  create: (data: any): Promise<TourMember> => 
    api.post('/tour-members', data).then(res => res.data),
  
  update: (id: string, data: any): Promise<TourMember> => 
    api.put(`/tour-members/${id}`, data).then(res => res.data),
  
  delete: (id: string): Promise<void> => 
    api.delete(`/tour-members/${id}`),
  
  addPayment: (tourMemberId: string, data: any): Promise<Payment> => 
    api.post(`/tour-members/${tourMemberId}/payments`, data).then(res => res.data),
  
  updatePayment: (tourMemberId: string, paymentId: string, data: any): Promise<Payment> => 
    api.put(`/tour-members/${tourMemberId}/payments/${paymentId}`, data).then(res => res.data),
  
  deletePayment: (tourMemberId: string, paymentId: string): Promise<void> => 
    api.delete(`/tour-members/${tourMemberId}/payments/${paymentId}`),

  getTourMembersStats: (tourId: string): Promise<TourMemberStats> => 
    api.get(`/tour-members/stats?tourId=${tourId}`).then(res => res.data.data),


};

export const memberApi = {
  getAll:async (): Promise<Member[]> => 
 {
  const result =  await api.get('/members');
  return result.data?.data?.data
 } 
};

export const tourPackageApi = {
  getById: (id: string): Promise<TourPackage> => 
    api.get(`/tour-packages/${id}`).then(res => res.data),
};