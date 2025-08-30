'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardAPI } from '@/lib/api';

export default function TestCoinGeckoPage() {
  const [isTesting, setIsTesting] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['test-coingecko'],
    queryFn: dashboardAPI.testCoinGecko,
    enabled: false, // Don't run automatically
  });

  const handleTest = async () => {
    setIsTesting(true);
    await refetch();
    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CoinGecko API Test</h1>
          <p className="text-gray-600 mt-2">Test the CoinGecko API integration</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
            <CardDescription>
              Click the button below to test the CoinGecko API connection and fetch sample data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleTest}
              disabled={isLoading || isTesting}
              className="w-full"
            >
              {isLoading || isTesting ? 'Testing...' : 'Test CoinGecko API'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-600 text-sm mt-1">
                  {error instanceof Error ? error.message : 'An error occurred'}
                </p>
              </div>
            )}

            {data && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-medium text-green-800">Success!</h3>
                  <p className="text-green-600 text-sm mt-1">
                    CoinGecko API is working correctly.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">API Status</h4>
                    <p className="text-sm text-gray-600">
                      Connection: {data.isAlive ? '✅ Alive' : '❌ Dead'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Global Market Data</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Total Market Cap: ${data.globalData.totalMarketCap.toLocaleString()}</p>
                      <p>24h Volume: ${data.globalData.totalVolume24h.toLocaleString()}</p>
                      <p>Market Cap Change 24h: {data.globalData.marketCapChange24h.toFixed(2)}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Top 5 Coins</h4>
                    <div className="space-y-2">
                      {data.topCoins.map((coin: any) => (
                        <div key={coin.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                            <span className="font-medium">{coin.name}</span>
                            <span className="text-gray-500">({coin.symbol})</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${coin.current_price.toLocaleString()}</p>
                            <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
