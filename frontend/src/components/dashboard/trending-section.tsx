'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { CoinData } from '@crypto-dashboard/shared';

interface TrendingSectionProps {
  coins: CoinData[];
  title?: string;
  icon?: string;
}

export function TrendingSection({ coins, title = "Trending", icon = "🔥" }: TrendingSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) {
      return 'N/A';
    }
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            View more &gt;
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {coins.map((coin) => (
          <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <img 
                src={coin.image} 
                alt={coin.name}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/32x32?text=' + coin.symbol.charAt(0);
                }}
              />
              <div>
                <p className="font-medium text-sm">{coin.name}</p>
                <p className="text-xs text-gray-500">{coin.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">{formatCurrency(coin.current_price)}</p>
              <div className="flex items-center text-green-600 text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {formatPercentage(coin.price_change_percentage_24h)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
