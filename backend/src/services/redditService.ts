import axios from 'axios';
import logger from '../config/logger';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  subreddit: string;
  score: number;
  created_utc: number;
  permalink: string;
  is_video: boolean;
  thumbnail: string;
  post_hint?: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

export interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
    after: string | null;
    before: string | null;
  };
}

export class RedditService {
  private clientId: string;
  private clientSecret: string;
  private userAgent: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID || '';
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET || '';
    this.userAgent = process.env.REDDIT_USER_AGENT || 'web:crypto-dashboard:v1.0.0 (by /u/Frosty-Ground8595)';

    if (!this.clientId || !this.clientSecret) {
      logger.warn('Reddit API credentials not configured, service will use fallback');
    }
  }

  private async authenticate(): Promise<void> {
    try {
      if (!this.clientId || !this.clientSecret) {
        throw new Error('Reddit API credentials not configured');
      }

      // Check if we have a valid token
      if (this.accessToken && Date.now() < this.tokenExpiry) {
        return;
      }

      logger.info('Authenticating with Reddit API...');

      const response = await axios.post(
        'https://www.reddit.com/api/v1/access_token',
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': this.userAgent,
          },
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      logger.info('Reddit authentication successful');
    } catch (error) {
      logger.error('Reddit authentication failed:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getCryptoMemes(limit: number = 10): Promise<RedditPost[]> {
    try {
      if (!this.clientId || !this.clientSecret) {
        logger.warn('Reddit API not configured, returning empty array');
        return [];
      }

      await this.authenticate();

      // Popular crypto meme subreddits (prioritize active ones)
      const subreddits = [
        'cryptocurrencymemes',
        'bitcoinmemes',
        'cryptomemes'
      ];

      // Randomly select a subreddit for variety
      const randomSubreddit = subreddits[Math.floor(Math.random() * subreddits.length)];

      logger.info(`Fetching memes from r/${randomSubreddit}`);

      const response = await axios.get<RedditResponse>(
        `https://oauth.reddit.com/r/${randomSubreddit}/hot.json?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': this.userAgent,
          },
        }
      );

      const posts = response.data.data.children
        .map(child => child.data)
        .filter(post => {
          // Filter for image posts only
          const isImagePost = post.post_hint === 'image' || 
                             (post.url && (
                               post.url.includes('.jpg') || 
                               post.url.includes('.png') || 
                               post.url.includes('.gif') ||
                               post.url.includes('.jpeg') ||
                               post.url.includes('i.redd.it') ||
                               post.url.includes('imgur.com') ||
                               post.url.includes('reddit.com/gallery')
                             ));
          
          // Must have a valid image URL and not be a video
          return !post.is_video && 
                 post.url && 
                 isImagePost &&
                 post.thumbnail !== 'nsfw' &&
                 post.thumbnail !== 'default';
        })
        .slice(0, limit);

      logger.info(`Retrieved ${posts.length} memes from r/${randomSubreddit}`);
      return posts;

    } catch (error) {
      logger.error('Error fetching Reddit memes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getMemesBySubreddit(subreddit: string, limit: number = 10): Promise<RedditPost[]> {
    try {
      if (!this.clientId || !this.clientSecret) {
        logger.warn('Reddit API not configured, returning empty array');
        return [];
      }

      await this.authenticate();

      logger.info(`Fetching memes from r/${subreddit}`);

      const response = await axios.get<RedditResponse>(
        `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'User-Agent': this.userAgent,
          },
        }
      );

      const posts = response.data.data.children
        .map(child => child.data)
        .filter(post => {
          // Filter for image posts only
          const isImagePost = post.post_hint === 'image' || 
                             (post.url && (
                               post.url.includes('.jpg') || 
                               post.url.includes('.png') || 
                               post.url.includes('.gif') ||
                               post.url.includes('.jpeg') ||
                               post.url.includes('i.redd.it') ||
                               post.url.includes('imgur.com') ||
                               post.url.includes('reddit.com/gallery')
                             ));
          
          // Must have a valid image URL and not be a video
          return !post.is_video && 
                 post.url && 
                 isImagePost &&
                 post.thumbnail !== 'nsfw' &&
                 post.thumbnail !== 'default';
        })
        .slice(0, limit);

      logger.info(`Retrieved ${posts.length} memes from r/${subreddit}`);
      return posts;

    } catch (error) {
      logger.error(`Error fetching memes from r/${subreddit}:`, error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  async getTrendingMemes(limit: number = 10): Promise<RedditPost[]> {
    try {
      if (!this.clientId || !this.clientSecret) {
        logger.warn('Reddit API not configured, returning empty array');
        return [];
      }

      await this.authenticate();

      // Get memes from multiple subreddits and combine them
      const subreddits = ['cryptocurrencymemes', 'bitcoinmemes', 'cryptomemes'];
      const allPosts: RedditPost[] = [];

      for (const subreddit of subreddits) {
        try {
          const posts = await this.getMemesBySubreddit(subreddit, Math.ceil(limit / subreddits.length));
          allPosts.push(...posts);
        } catch (error) {
          logger.warn(`Failed to fetch from r/${subreddit}:`, error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Sort by score (upvotes) and take the best ones
      const sortedPosts = allPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      logger.info(`Retrieved ${sortedPosts.length} trending memes from multiple subreddits`);
      return sortedPosts;

    } catch (error) {
      logger.error('Error fetching trending memes:', error instanceof Error ? error.message : 'Unknown error');
      return [];
    }
  }

  isConfigured(): boolean {
    return !!(this.clientId && this.clientSecret);
  }

  getStatus(): {
    configured: boolean;
    authenticated: boolean;
    tokenExpiry: number;
  } {
    return {
      configured: this.isConfigured(),
      authenticated: !!(this.accessToken && Date.now() < this.tokenExpiry),
      tokenExpiry: this.tokenExpiry,
    };
  }
}

export const redditService = new RedditService();
