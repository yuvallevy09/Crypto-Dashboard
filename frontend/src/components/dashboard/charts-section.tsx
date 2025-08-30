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
  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['chart-data', selectedCoin, timePeriod],
    queryFn: () => dashboardAPI.getChartData(selectedCoin, getDaysFromPeriod(timePeriod)),
    enabled: !!selectedCoin,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry up to 2 times
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Transform API data for chart with better labeling and data processing
  const transformChartData = (rawData: any, period: TimePeriod) => {
    if (!rawData?.prices) return [];

    const prices = rawData.prices.map(([timestamp, price]: [number, number]) => ({
      timestamp,
      price: Math.round(price * 100) / 100, // Keep 2 decimal places for better precision
    }));

    // Remove duplicate labels by grouping data points
    const groupedData: { [key: string]: { timestamp: number; price: number; count: number } } = {};
    
    prices.forEach(({ timestamp, price }) => {
      const date = new Date(timestamp);
      let timeKey = '';
      
      switch (period) {
        case '24h':
          // Round to nearest hour for 24h
          const hour = Math.floor(date.getHours() / 1) * 1;
          timeKey = `${date.getDate()}-${hour}`;
          break;
        case '7d':
          // Group by day for 7d
          timeKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case '1m':
          // Group by day for 1m
          timeKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          break;
        case '3m':
          // Group by 10-day intervals for 3m
          const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
          const interval = Math.floor(dayOfYear / 10) * 10;
          timeKey = `${date.getFullYear()}-${interval}`;
          break;
        case '1y':
          // Group by month for 1y
          timeKey = `${date.getFullYear()}-${date.getMonth()}`;
          break;
      }

      if (groupedData[timeKey]) {
        groupedData[timeKey].price = (groupedData[timeKey].price + price) / 2; // Average price for the period
        groupedData[timeKey].count++;
      } else {
        groupedData[timeKey] = { timestamp, price, count: 1 };
      }
    });

    // Convert grouped data back to array and create labels
    const sortedData = Object.values(groupedData)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ timestamp, price }) => {
      const date = new Date(timestamp);
      
      let timeLabel = '';
      switch (period) {
        case '24h':
          // Round to nearest hour
          const hour = Math.floor(date.getHours() / 1) * 1;
          timeLabel = `${hour.toString().padStart(2, '0')}:00`;
          break;
        case '7d':
          timeLabel = `${date.getDate()}. ${date.toLocaleDateString('en-US', { month: 'short' })}`;
          break;
        case '1m':
          timeLabel = `${date.getDate()}. ${date.toLocaleDateString('en-US', { month: 'short' })}`;
          break;
        case '3m':
          timeLabel = `${date.getDate()}. ${date.toLocaleDateString('en-US', { month: 'short' })}`;
          break;
        case '1y':
          timeLabel = `${date.toLocaleDateString('en-US', { month: 'short' })} '${date.getFullYear().toString().slice(-2)}`;
          break;
      }

              return {
          time: timeLabel,
          price,
          timestamp,
        };
      });

    return sortedData;
  };

  const transformedChartData = transformChartData(chartData, timePeriod);
  const selectedCoinData = coins.find(coin => coin.id === selectedCoin);

  // Calculate dynamic Y-axis domain based on data range
  const getYAxisDomain = () => {
    if (transformedChartData.length === 0) return [0, 100];
    
    const prices = transformedChartData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    // Add 10% padding to the range
    const padding = range * 0.1;
    const domainMin = Math.max(0, minPrice - padding);
    const domainMax = maxPrice + padding;
    
    return [domainMin, domainMax];
  };

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
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(payload[0].value)}
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
              <SelectTrigger className="w-40">
                <SelectValue>
                  {selectedCoinData && (
                    <div className="flex items-center space-x-2">
                      <img src={selectedCoinData.image} alt={selectedCoinData.name} className="w-4 h-4" />
                      <span>{selectedCoinData.symbol.toUpperCase()}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {coins.length > 0 ? (
                  coins.slice(0, 20).map((coin) => ( // Show first 20 coins
                    <SelectItem key={coin.id} value={coin.id}>
                      <div className="flex items-center space-x-2">
                        <img src={coin.image} alt={coin.name} className="w-4 h-4" />
                        <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                        <span className="text-gray-500 text-xs">{coin.name}</span>
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
            <div className="flex items-center justify-between">
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
              {!chartLoading && !chartError && (
                <div className="text-xs text-gray-400">
                  {transformedChartData.length > 0 ? 'Live data' : 'Cached data'}
                </div>
              )}
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
              ) : chartError ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-sm text-red-600">Failed to load chart data</p>
                    <p className="text-xs">API rate limit exceeded. Please try again in a moment.</p>
                  </div>
                </div>
              ) : transformedChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transformedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={getYAxisDomain()}
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
