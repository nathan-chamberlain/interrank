'use client';

import { useAccount } from '@/lib/AccountProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Wait a bit before checking authentication
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 100); // Wait 1 second

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't redirect during initialization or if already on login page or if authenticated
    if (isInitializing || pathname === '/login' || isAuthenticated) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, pathname, isInitializing]);

  // Always render children for login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Show loading while initializing or redirecting for protected pages
  if (isInitializing || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}