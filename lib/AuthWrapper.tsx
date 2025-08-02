'use client';

import { useAccount } from '@/lib/AccountProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on login page or if authenticated
    if (pathname === '/login' || isAuthenticated) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, pathname]);

  // Always render children for login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Show loading while redirecting for protected pages
  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
}