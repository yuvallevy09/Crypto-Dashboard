import logger from '../config/logger';
import { redditService, RedditPost } from './redditService';

export interface MemeData {
  id: string;
  title: string;
  url: string;
  source: string;
  tags: string[];
  description?: string;
  category?: 'HODL' | 'PUMP' | 'DUMP' | 'FOMO' | 'FUD' | 'GENERAL';
}

export class MemeService {
  private cache: Map<string, MemeData> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  constructor() {
    this.initializeCache();
  }

  private initializeCache(): void {
    // Curated collection of crypto memes
    const memes: MemeData[] = [
      {
        id: 'hodl-1',
        title: 'HODL the Line! 💎🙌',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['HODL', 'BTC', 'DIAMOND_HANDS'],
        description: 'When the market dips but you stay strong',
        category: 'HODL'
      },
      {
        id: 'pump-1',
        title: 'To The Moon! 🚀',
        url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['PUMP', 'MOON', 'LAMBO'],
        description: 'Every crypto trader\'s dream',
        category: 'PUMP'
      },
      {
        id: 'fomo-1',
        title: 'FOMO is Real 😰',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['FOMO', 'PANIC', 'BUY'],
        description: 'When you see everyone else making money',
        category: 'FOMO'
      },
      {
        id: 'dump-1',
        title: 'Paper Hands 📄',
        url: 'https://images.unsplash.com/photo-1589820296150-ecf34d9c2e6a?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['DUMP', 'PAPER_HANDS', 'SELL'],
        description: 'Selling at the first sign of trouble',
        category: 'DUMP'
      },
      {
        id: 'fud-1',
        title: 'FUD Spreaders 🤡',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['FUD', 'BEAR', 'NEGATIVE'],
        description: 'Spreading fear, uncertainty, and doubt',
        category: 'FUD'
      },
      {
        id: 'whale-1',
        title: 'Whale Watching 🐋',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['WHALE', 'BIG_MONEY', 'MOVEMENT'],
        description: 'Following the big players',
        category: 'GENERAL'
      },
      {
        id: 'diamond-1',
        title: 'Diamond Hands 💎',
        url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['DIAMOND_HANDS', 'HODL', 'STRONG'],
        description: 'Unbreakable conviction',
        category: 'HODL'
      },
      {
        id: 'lambo-1',
        title: 'Lambo Dreams 🏎️',
        url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['LAMBO', 'DREAMS', 'RICH'],
        description: 'The ultimate crypto goal',
        category: 'PUMP'
      },
      {
        id: 'bear-1',
        title: 'Bear Market Blues 🐻',
        url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['BEAR', 'DOWN', 'SAD'],
        description: 'When everything is red',
        category: 'DUMP'
      },
      {
        id: 'bull-1',
        title: 'Bull Run Energy 🐂',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['BULL', 'UP', 'ENERGY'],
        description: 'Unstoppable upward momentum',
        category: 'PUMP'
      },
      {
        id: 'satoshi-1',
        title: 'Satoshi\'s Vision 👁️',
        url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['SATOSHI', 'BTC', 'VISION'],
        description: 'The original crypto dream',
        category: 'GENERAL'
      },
      {
        id: 'altcoin-1',
        title: 'Altcoin Season 🌈',
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['ALTCOIN', 'SEASON', 'COLORS'],
        description: 'When alts start pumping',
        category: 'PUMP'
      },
      {
        id: 'degen-1',
        title: 'Degen Life 🎰',
        url: 'https://images.unsplash.com/photo-1589820296150-ecf34d9c2e6a?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['DEGEN', 'GAMBLE', 'RISK'],
        description: 'Living on the edge',
        category: 'GENERAL'
      },
      {
        id: 'stack-1',
        title: 'Stack Sats 📚',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['STACK', 'SATS', 'DCA'],
        description: 'Dollar cost averaging like a pro',
        category: 'HODL'
      },
      {
        id: 'moon-1',
        title: 'Moon Mission 🌙',
        url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop&crop=center',
        source: 'CryptoMemes.com',
        tags: ['MOON', 'MISSION', 'SPACE'],
        description: 'Next stop: the moon!',
        category: 'PUMP'
      }
    ];

    // Add all memes to cache
    memes.forEach(meme => {
      this.cache.set(meme.id, meme);
    });

    logger.info(`Initialized meme cache with ${memes.length} memes`);
  }

  async getRandomMeme(): Promise<MemeData> {
    try {
      // Try to get Reddit memes first
      if (redditService.isConfigured()) {
        try {
          const redditMemes = await redditService.getCryptoMemes(5);
          if (redditMemes.length > 0) {
            const randomRedditMeme = redditMemes[Math.floor(Math.random() * redditMemes.length)];
            const memeData = this.convertRedditPostToMemeData(randomRedditMeme);
            logger.info('Retrieved Reddit meme', { memeId: memeData.id, title: memeData.title });
            return memeData;
          }
        } catch (error) {
          logger.warn('Reddit meme fetch failed, falling back to curated memes:', error instanceof Error ? error.message : 'Unknown error');
        }
      }

      // Fallback to curated memes
      // Check if cache needs refresh
      if (Date.now() - this.lastFetch > this.CACHE_DURATION) {
        await this.refreshCache();
      }

      // Get all meme IDs
      const memeIds = Array.from(this.cache.keys());
      
      if (memeIds.length === 0) {
        throw new Error('No memes available in cache');
      }

      // Select random meme
      const randomId = memeIds[Math.floor(Math.random() * memeIds.length)];
      const meme = this.cache.get(randomId);

      if (!meme) {
        throw new Error('Failed to retrieve random meme');
      }

      logger.info('Retrieved curated meme', { memeId: meme.id, title: meme.title });
      return meme;

    } catch (error) {
      logger.error('Error getting random meme:', error);
      return this.getFallbackMeme();
    }
  }

  async getMemeByCategory(category: MemeData['category']): Promise<MemeData> {
    try {
      // Check if cache needs refresh
      if (Date.now() - this.lastFetch > this.CACHE_DURATION) {
        await this.refreshCache();
      }

      // Filter memes by category
      const categoryMemes = Array.from(this.cache.values())
        .filter(meme => meme.category === category);

      if (categoryMemes.length === 0) {
        logger.warn(`No memes found for category: ${category}, returning random meme`);
        return this.getRandomMeme();
      }

      // Select random meme from category
      const randomMeme = categoryMemes[Math.floor(Math.random() * categoryMemes.length)];
      
      logger.info('Retrieved meme by category', { category, memeId: randomMeme.id });
      return randomMeme;

    } catch (error) {
      logger.error('Error getting meme by category:', error);
      return this.getFallbackMeme();
    }
  }

  async getMemeByTags(tags: string[]): Promise<MemeData> {
    try {
      // Check if cache needs refresh
      if (Date.now() - this.lastFetch > this.CACHE_DURATION) {
        await this.refreshCache();
      }

      // Filter memes by tags
      const taggedMemes = Array.from(this.cache.values())
        .filter(meme => tags.some(tag => meme.tags.includes(tag)));

      if (taggedMemes.length === 0) {
        logger.warn(`No memes found for tags: ${tags.join(', ')}, returning random meme`);
        return this.getRandomMeme();
      }

      // Select random meme from filtered results
      const randomMeme = taggedMemes[Math.floor(Math.random() * taggedMemes.length)];
      
      logger.info('Retrieved meme by tags', { tags, memeId: randomMeme.id });
      return randomMeme;

    } catch (error) {
      logger.error('Error getting meme by tags:', error);
      return this.getFallbackMeme();
    }
  }

  private async refreshCache(): Promise<void> {
    try {
      // For now, we'll just update the timestamp
      // In the future, this could fetch new memes from an external API
      this.lastFetch = Date.now();
      logger.info('Meme cache refreshed');
    } catch (error) {
      logger.error('Error refreshing meme cache:', error);
    }
  }

  private convertRedditPostToMemeData(redditPost: RedditPost): MemeData {
    // Get the best image URL available
    let imageUrl = redditPost.url;
    
    // If there's a preview with better quality, use that
    if (redditPost.preview && redditPost.preview.images.length > 0) {
      imageUrl = redditPost.preview.images[0].source.url;
    }
    
    // Clean up Reddit image URLs (remove encoding)
    if (imageUrl.includes('&amp;')) {
      imageUrl = imageUrl.replace(/&amp;/g, '&');
    }

    // Extract tags from title and subreddit
    const tags = this.extractTagsFromTitle(redditPost.title);
    tags.push(redditPost.subreddit.toUpperCase());

    return {
      id: `reddit-${redditPost.id}`,
      title: redditPost.title,
      url: imageUrl,
      source: `r/${redditPost.subreddit} by u/${redditPost.author}`,
      tags,
      description: `Reddit meme with ${redditPost.score} upvotes`,
      category: this.categorizeMeme(redditPost.title, tags),
    };
  }

  private extractTagsFromTitle(title: string): string[] {
    const commonTags = [
      'BTC', 'ETH', 'HODL', 'MOON', 'PUMP', 'DUMP', 'FOMO', 'FUD',
      'DIAMOND', 'PAPER', 'WHALE', 'BULL', 'BEAR', 'LAMBO', 'SATOSHI'
    ];
    
    const titleUpper = title.toUpperCase();
    return commonTags.filter(tag => titleUpper.includes(tag));
  }

  private categorizeMeme(title: string, tags: string[]): MemeData['category'] {
    const titleUpper = title.toUpperCase();
    
    if (tags.includes('HODL') || titleUpper.includes('HOLD') || titleUpper.includes('DIAMOND')) {
      return 'HODL';
    }
    if (tags.includes('PUMP') || titleUpper.includes('MOON') || titleUpper.includes('LAMBO')) {
      return 'PUMP';
    }
    if (tags.includes('DUMP') || titleUpper.includes('BEAR') || titleUpper.includes('PAPER')) {
      return 'DUMP';
    }
    if (tags.includes('FOMO') || titleUpper.includes('FOMO')) {
      return 'FOMO';
    }
    if (tags.includes('FUD') || titleUpper.includes('FUD')) {
      return 'FUD';
    }
    
    return 'GENERAL';
  }

  private getFallbackMeme(): MemeData {
    logger.warn('Using fallback meme');
    return {
      id: 'fallback-1',
      title: 'Crypto Life 🚀',
      url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center',
      source: 'CryptoMemes.com',
      tags: ['CRYPTO', 'LIFE', 'FUN'],
      description: 'The crypto journey continues...',
      category: 'GENERAL'
    };
  }

  getCacheStats(): { size: number; lastFetch: number; categories: string[] } {
    const categories = Array.from(new Set(Array.from(this.cache.values()).map(meme => meme.category)));
    return {
      size: this.cache.size,
      lastFetch: this.lastFetch,
      categories: categories.filter(Boolean) as string[]
    };
  }
}

export const memeService = new MemeService();
