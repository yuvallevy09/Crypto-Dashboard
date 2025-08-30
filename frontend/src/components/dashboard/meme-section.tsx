'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, RefreshCw, ExternalLink } from 'lucide-react';
import { Meme, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';

interface MemeSectionProps {
  meme: Meme;
}

export function MemeSection({ meme }: MemeSectionProps) {
  const [imageError, setImageError] = useState(false);
  const queryClient = useQueryClient();

  const feedbackMutation = useMutation({
    mutationFn: ({ contentId, rating }: { contentId: string; rating: FeedbackType }) =>
      dashboardAPI.submitFeedback({
        contentType: ContentType.MEME,
        contentId,
        rating,
      }),
  });

  const handleFeedback = (rating: FeedbackType) => {
    feedbackMutation.mutate({ contentId: meme.id, rating });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="h-96 flex flex-col">
          <div className="bg-gray-100 rounded-lg overflow-hidden flex-1 flex items-center justify-center mb-3">
            {!imageError ? (
              <img
                src={meme.url}
                alt={meme.title}
                className="w-full h-full object-contain max-w-full max-h-full"
                onError={handleImageError}
              />
            ) : (
              <div className="text-center p-4">
                <div className="text-4xl mb-2">😂</div>
                <p className="text-sm text-gray-600">{meme.title}</p>
              </div>
            )}
          </div>
          
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold font-mono tracking-wide line-clamp-2">
              {meme.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-8 w-8 p-0"
              title="Get new meme"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(FeedbackType.THUMBS_UP)}
                disabled={feedbackMutation.isPending}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(FeedbackType.THUMBS_DOWN)}
                disabled={feedbackMutation.isPending}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="border-t pt-3">
            <p className="text-xs text-gray-500">Source: {meme.source}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
