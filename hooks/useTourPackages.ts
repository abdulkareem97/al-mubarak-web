import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { TourPackage, TourPackageFormData } from '@/types/tour-package';
import { toast } from 'sonner';
import api from '@/lib/api';

interface FilterParams {
  search?: string;
  priceRange?: string;
  seatRange?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const useTourPackages = (page = 1, limit = 10, search = '', filters?: FilterParams) => {
  return useQuery({
    queryKey: ['tour-packages', page, limit, search, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filters && filters),
      });
      const response = await api.get(`/tour-packages?${params}`);
      return response.data.data;
    },
  });
};

export const useTourPackage = (id: string) => {
  return useQuery({
    queryKey: ['tour-package', id],
    queryFn: async () => {
      const response = await api.get(`/tour-packages/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useCreateTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TourPackageFormData) => {
      const formData = new FormData();
      formData.append('packageName', data.packageName);
      formData.append('tourPrice', data.tourPrice.toString());
      formData.append('totalSeat', data.totalSeat.toString());
      formData.append('desc', data.desc);
      
      if (data.coverPhoto instanceof File) {
        formData.append('coverPhoto', data.coverPhoto);
      }
      
      const response = await api.post('/tour-packages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-packages'] });
      toast.success('Tour package created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create tour package');
    },
  });
};

export const useUpdateTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TourPackageFormData }) => {
      const formData = new FormData();
      formData.append('packageName', data.packageName);
      formData.append('tourPrice', data.tourPrice.toString());
      formData.append('totalSeat', data.totalSeat.toString());
      formData.append('desc', data.desc);
      
      if (data.coverPhoto instanceof File) {
        formData.append('coverPhoto', data.coverPhoto);
      }
      
      const response = await api.put(`/tour-packages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-packages'] });
      queryClient.invalidateQueries({ queryKey: ['tour-package'] });
      toast.success('Tour package updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update tour package');
    },
  });
};

export const useDeleteTourPackage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/tour-packages/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tour-packages'] });
      toast.success('Tour package deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete tour package');
    },
  });
};

