'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setHydrated } = useAuthStore();

  useEffect(() => {
    // Mark the store as hydrated after the component mounts
    setHydrated(true);
  }, [setHydrated]);

  return <>{children}</>;
}
