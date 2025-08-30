'use client';

import { useState } from 'react';
import { AIInsight, ContentType, FeedbackType } from '@crypto-dashboard/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, RefreshCw, Brain, Sparkles } from 'lucide-react';
import { dashboardAPI } from '@/lib/api';
import { toast } from 'sonner';

interface AIInsightSectionProps {
  aiInsight: AIInsight;
}

export function AIInsightSection({ aiInsight }: AIInsightSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const handleFeedback = async (rating: FeedbackType) => {
    if (hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await dashboardAPI.submitFeedback(ContentType.AI_INSIGHT, aiInsight.id, rating);
      setHasVoted(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'MARKET_ANALYSIS':
        return <Brain className="h-4 w-4" />;
      case 'EDUCATIONAL':
        return <Sparkles className="h-4 w-4" />;
      case 'PREDICTION':
        return <Sparkles className="h-4 w-4" />;
      case 'TIPS':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightTypeLabel = (type: string) => {
    switch (type) {
      case 'MARKET_ANALYSIS':
        return 'Market Analysis';
      case 'EDUCATIONAL':
        return 'Educational';
      case 'PREDICTION':
        return 'Prediction';
      case 'TIPS':
        return 'Trading Tips';
      default:
        return 'Insight';
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold">AI Insight of the Day</CardTitle>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {getInsightTypeIcon(aiInsight.type)}
            <span>{getInsightTypeLabel(aiInsight.type)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Generated {formatDate(aiInsight.createdAt)}</span>
          <span className="flex items-center space-x-1">
            <span>Confidence:</span>
            <span className={`font-medium ${
              aiInsight.confidence >= 0.8 ? 'text-green-600' :
              aiInsight.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(aiInsight.confidence * 100)}%
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <p className="text-gray-800 leading-relaxed">
              {aiInsight.content}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(FeedbackType.THUMBS_UP)}
                disabled={hasVoted || isSubmitting}
                className={`flex items-center space-x-1 ${
                  hasVoted ? 'text-green-600' : 'hover:text-green-600'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(FeedbackType.THUMBS_DOWN)}
                disabled={hasVoted || isSubmitting}
                className={`flex items-center space-x-1 ${
                  hasVoted ? 'text-red-600' : 'hover:text-red-600'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Not Helpful</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <RefreshCw className="h-3 w-3" />
              <span>Updates daily</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
