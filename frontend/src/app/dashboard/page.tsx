'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ChartsSection } from '@/components/dashboard/charts-section';
import { NewsSection } from '@/components/dashboard/news-section';
import { CoinPricesSection } from '@/components/dashboard/coin-prices-section';
import { MemeSection } from '@/components/dashboard/meme-section';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, token, isHydrated } = useAuthStore();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardAPI.getData,
    enabled: isAuthenticated && !!token && isHydrated,
    refetchInterval: 120000, // Refetch every 2 minutes instead of 30 seconds
  });

  useEffect(() => {
    // Wait for hydration to complete before checking authentication
    if (isHydrated && !isAuthenticated && !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token, isHydrated, router]);

  // Show loading while checking authentication
  if (!isHydrated || (!isAuthenticated && !token)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Charts and News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartsSection coins={dashboardData.coinPrices} />
          <NewsSection news={dashboardData.news} />
        </div>

        {/* Coin Prices and Meme */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <CoinPricesSection coins={dashboardData.coinPrices} />
          </div>
          <div className="lg:w-1/3">
            <MemeSection meme={dashboardData.meme} />
          </div>
        </div>
      </div>
    </div>
  );
}
