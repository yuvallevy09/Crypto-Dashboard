'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react';
import { NewsItem, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';

interface NewsSectionProps {
  news: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  const feedbackMutation = useMutation({
    mutationFn: ({ contentId, rating }: { contentId: string; rating: FeedbackType }) =>
      dashboardAPI.submitFeedback(ContentType.NEWS, contentId, rating),
  });

  const handleFeedback = (contentId: string, rating: FeedbackType) => {
    feedbackMutation.mutate({ contentId, rating });
  };

  const formatTimeAgo = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Unknown';
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Market News</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80 overflow-y-auto">
          <div className="p-4 space-y-3">
            {news.map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-500">{formatTimeAgo(item.publishedAt)}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 truncate">{item.source}</span>
                      {item.dataSource && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <Badge 
                            variant={item.dataSource === 'cryptopanic' ? 'default' : 'secondary'} 
                            className="text-xs"
                          >
                            {item.dataSource === 'cryptopanic' ? 'Live' : 'Demo'}
                          </Badge>
                        </>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{item.tags.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-3 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(item.url, '_blank')}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(item.id, FeedbackType.THUMBS_UP)}
                        disabled={feedbackMutation.isPending}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(item.id, FeedbackType.THUMBS_DOWN)}
                        disabled={feedbackMutation.isPending}
                        className="h-6 w-6 p-0"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
