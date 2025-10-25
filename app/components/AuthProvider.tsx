'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/auth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkUser = useAuthStore((state) => state.checkUser);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}