// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  useEffect(() => {
    // Check if token exists in localStorage on mount
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !token) {
        // Token exists but not in store - this shouldn't happen with persistence
        // but it's a safety check
        console.warn('Token found in localStorage but not in store');
      }
    }
  }, [token]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isLoading: false, // You can add loading states if needed
  };
};