'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface MarketOverviewData {
  totalMarketCap: number;
  totalVolume24h: number;
  marketCapChange24h: number;
  volumeChange24h: number;
}

interface MarketOverviewProps {
  data: MarketOverviewData;
}

export function MarketOverview({ data }: MarketOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Cryptocurrency Prices by Market Cap</h2>
        <p className="text-gray-600">AI insight of the day: Market consolidation continues as Bitcoin maintains dominance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(data.totalMarketCap)}</p>
                <div className={`flex items-center mt-1 ${
                  data.marketCapChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.marketCapChange24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm">{formatPercentage(data.marketCapChange24h)}</span>
                </div>
              </div>
              <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                <div className="w-full h-1 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">24h Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(data.totalVolume24h)}</p>
                <div className={`flex items-center mt-1 ${
                  data.volumeChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.volumeChange24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm">{formatPercentage(data.volumeChange24h)}</span>
                </div>
              </div>
              <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                <div className="w-full h-1 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
