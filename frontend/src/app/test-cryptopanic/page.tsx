'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  tags: string[];
}

interface CryptoPanicTestData {
  trendingNews: NewsItem[];
  bullishNews: NewsItem[];
  cacheStats: {
    size: number;
    keys: string[];
  };
}

export default function TestCryptoPanicPage() {
  const router = useRouter();
  const { isAuthenticated, user, token, isHydrated } = useAuthStore();
  const [testData, setTestData] = useState<CryptoPanicTestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !isAuthenticated && !token) {
      router.push('/login');
    }
  }, [isAuthenticated, token, isHydrated, router]);

  const testCryptoPanicAPI = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/test-cryptopanic`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTestData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test CryptoPanic API');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      testCryptoPanicAPI();
    }
  }, [isAuthenticated, token]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CryptoPanic API Test</h1>
          <p className="text-gray-600">Testing the CryptoPanic API integration</p>
        </div>

        <div className="mb-6">
          <Button 
            onClick={testCryptoPanicAPI} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Testing...' : 'Test API Again'}
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {testData && (
          <div className="space-y-6">
            {/* Cache Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Cache Statistics</CardTitle>
                <CardDescription>Current cache status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cache Size</p>
                    <p className="text-2xl font-bold">{testData.cacheStats.size}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cache Keys</p>
                    <p className="text-sm text-gray-700">
                      {testData.cacheStats.keys.length > 0 
                        ? testData.cacheStats.keys.join(', ')
                        : 'No cached data'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending News */}
            <Card>
              <CardHeader>
                <CardTitle>Trending News ({testData.trendingNews.length})</CardTitle>
                <CardDescription>Latest trending crypto news from CryptoPanic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testData.trendingNews.map((news) => (
                    <div key={news.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{news.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{new Date(news.publishedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {news.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(news.url, '_blank')}
                          className="ml-4"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bullish News */}
            <Card>
              <CardHeader>
                <CardTitle>Bullish News ({testData.bullishNews.length})</CardTitle>
                <CardDescription>Bullish sentiment crypto news</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testData.bullishNews.map((news) => (
                    <div key={news.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-2">{news.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <span>{news.source}</span>
                            <span>•</span>
                            <span>{new Date(news.publishedAt).toLocaleString()}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {news.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(news.url, '_blank')}
                          className="ml-4"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
