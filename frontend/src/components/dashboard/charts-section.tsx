'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ChartsSection() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Charts</CardTitle>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm">1D</Button>
            <Button variant="outline" size="sm">1W</Button>
            <Button variant="outline" size="sm">1M</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">Chart placeholder</p>
            <p className="text-xs">Recharts integration coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
