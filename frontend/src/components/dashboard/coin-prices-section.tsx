'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { CoinData } from '@crypto-dashboard/shared';

interface CoinPricesSectionProps {
  coins: CoinData[];
}

export function CoinPricesSection({ coins }: CoinPricesSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return formatCurrency(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Coin Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Rank</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Coin</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Price</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">1h</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">24h</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">7d</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">24h Volume</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={coin.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm text-gray-500">#{coin.market_cap_rank}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/24x24?text=' + coin.symbol.charAt(0);
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{coin.name}</p>
                        <p className="text-xs text-gray-500">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right text-sm font-medium">
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className={`py-3 px-2 text-right text-sm ${
                    (coin.price_change_percentage_1h_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(coin.price_change_percentage_1h_in_currency || 0)}
                  </td>
                  <td className={`py-3 px-2 text-right text-sm ${
                    coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </td>
                  <td className={`py-3 px-2 text-right text-sm ${
                    (coin.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(coin.price_change_percentage_7d_in_currency || 0)}
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-gray-600">
                    {formatVolume(coin.total_volume)}
                  </td>
                  <td className="py-3 px-2 text-right text-sm text-gray-600">
                    {formatVolume(coin.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
