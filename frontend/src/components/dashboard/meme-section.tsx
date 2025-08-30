'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Meme } from '@crypto-dashboard/shared';
import { useMutation } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';

interface MemeSectionProps {
  meme: Meme;
}

export function MemeSection({ meme }: MemeSectionProps) {
  const feedbackMutation = useMutation({
    mutationFn: ({ contentId, rating }: { contentId: string; rating: 'THUMBS_UP' | 'THUMBS_DOWN' }) =>
      dashboardAPI.submitFeedback({
        contentType: 'MEME',
        contentId,
        rating,
      }),
  });

  const handleFeedback = (rating: 'THUMBS_UP' | 'THUMBS_DOWN') => {
    feedbackMutation.mutate({ contentId: meme.id, rating });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Funny Meme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 rounded-lg p-4 h-48 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">😂</div>
            <p className="text-sm text-gray-600">{meme.title}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {meme.source}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {meme.tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('THUMBS_UP')}
              disabled={feedbackMutation.isPending}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('THUMBS_DOWN')}
              disabled={feedbackMutation.isPending}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
