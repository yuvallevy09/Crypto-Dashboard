'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import { CoinData } from '@crypto-dashboard/shared';

interface ChartsSectionProps {
  coins?: CoinData[];
}

type TimePeriod = '24h' | '7d' | '1m' | '3m' | '1y';

export function ChartsSection({ coins = [] }: ChartsSectionProps) {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('7d');

  // Map time periods to days for API
  const getDaysFromPeriod = (period: TimePeriod): number => {
    switch (period) {
      case '24h': return 1;
      case '7d': return 7;
      case '1m': return 30;
      case '3m': return 90;
      case '1y': return 365;
      default: return 7;
    }
  };

  // Fetch chart data from API
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chart-data', selectedCoin, timePeriod],
    queryFn: () => dashboardAPI.getChartData(selectedCoin, getDaysFromPeriod(timePeriod)),
    enabled: !!selectedCoin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform API data for chart
  const transformChartData = (rawData: any, period: TimePeriod) => {
    if (!rawData?.prices) return [];

    return rawData.prices.map(([timestamp, price]: [number, number]) => {
      const date = new Date(timestamp);
      
      let timeLabel = '';
      switch (period) {
        case '24h':
          timeLabel = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          break;
        case '7d':
          timeLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case '1m':
          timeLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          break;
        case '3m':
        case '1y':
          timeLabel = date.toLocaleDateString('en-US', { month: 'short' });
          break;
      }

      return {
        time: timeLabel,
        price: Math.round(price),
        timestamp,
      };
    });
  };

  const transformedChartData = transformChartData(chartData, timePeriod);
  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Price Charts</CardTitle>
          <div className="flex items-center space-x-3">
            {/* Coin Selector */}
            <Select value={selectedCoin} onValueChange={setSelectedCoin}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {coins.length > 0 ? (
                  coins.map((coin) => (
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center space-x-2">
                        <img src={coin.image} alt={coin.name} className="w-4 h-4" />
                        <span>{coin.symbol.toUpperCase()}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="bitcoin" disabled>
                    <div className="flex items-center space-x-2">
                      <span>No coins available</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {/* Time Period Tabs */}
            <div className="flex space-x-1">
              {(['24h', '7d', '1m', '3m', '1y'] as TimePeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={timePeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimePeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedCoinData ? (
          <div className="space-y-4">
            {/* Coin Info */}
            <div className="flex items-center space-x-3">
              <img 
                src={selectedCoinData.image} 
                alt={selectedCoinData.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{selectedCoinData.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatCurrency(selectedCoinData.current_price)}
                  <span className={`ml-2 ${
                    selectedCoinData.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedCoinData.price_change_percentage_24h >= 0 ? '+' : ''}
                    {selectedCoinData.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              {chartLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm">Loading chart data...</p>
                  </div>
                </div>
              ) : transformedChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transformedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-sm">No chart data available</p>
                    <p className="text-xs">Try selecting a different time period</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">No coin data available</p>
              <p className="text-xs">Please select a coin to view charts</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
