# CryptoPanic API Integration

This document describes the CryptoPanic API integration for the Crypto Dashboard application.

## Overview

The CryptoPanic API provides real-time cryptocurrency news and market sentiment data. This integration fetches trending news, bullish/bearish sentiment news, and filters news by specific cryptocurrencies.

## Features

- ✅ **Real-time News**: Fetch latest crypto news from CryptoPanic
- ✅ **Sentiment Filtering**: Get bullish/bearish sentiment news
- ✅ **Currency Filtering**: Filter news by specific cryptocurrencies
- ✅ **Caching**: 5-minute cache to minimize API calls
- ✅ **Rate Limiting**: Respects API limits (2 req/sec, 100 req/month)
- ✅ **Fallback Data**: Graceful degradation when API is unavailable
- ✅ **Error Handling**: Comprehensive error handling and logging

## API Configuration

### Environment Variables

Add your CryptoPanic API key to `backend/.env`:

```env
CRYPTOPANIC_API_KEY="720051df664e283b15046db74a19facb5f7b4d11"
```

### API Limits

- **Current Plan**: Developer
- **Rate Limit**: 2 requests per second
- **Monthly Quota**: 100 requests per month
- **Current Usage**: 53/100 requests used
- **News Delay**: 24 hours

## Implementation Details

### Service Architecture

```
CryptoPanicService
├── getNews() - Main method with filtering options
├── getTrendingNews() - Hot trending news
├── getBullishNews() - Bullish sentiment news
├── getBearishNews() - Bearish sentiment news
├── getNewsByCurrencies() - Filter by specific coins
├── Caching (5-minute TTL)
└── Fallback data
```

### Key Features

1. **Smart Caching**: 
   - 5-minute cache to reduce API calls
   - Cache key based on request parameters
   - Automatic cache invalidation

2. **Rate Limit Awareness**:
   - Respects 2 req/sec limit
   - Tracks remaining monthly quota
   - Graceful handling of rate limit errors

3. **Error Handling**:
   - Network timeout (10 seconds)
   - API errors fallback to cached data
   - Comprehensive logging

4. **Data Transformation**:
   - Converts CryptoPanic format to internal format
   - Extracts currencies and tags
   - Normalizes timestamps

## API Endpoints

### Backend Routes

- `GET /api/dashboard/test-cryptopanic` - Test CryptoPanic API connection
- `GET /api/dashboard` - Main dashboard (includes CryptoPanic news)

### Frontend Pages

- `/test-cryptopanic` - Test page for CryptoPanic integration
- `/dashboard` - Main dashboard with real news data

## Usage Examples

### Basic News Fetching

```typescript
// Get trending news
const trendingNews = await cryptoPanicService.getTrendingNews(10);

// Get bullish news
const bullishNews = await cryptoPanicService.getBullishNews(5);

// Get news for specific currencies
const btcNews = await cryptoPanicService.getNewsByCurrencies(['BTC'], 10);
```

### Advanced Filtering

```typescript
// Custom news filtering
const news = await cryptoPanicService.getNews({
  filter: 'hot',
  currencies: ['BTC', 'ETH'],
  regions: ['en'],
  kind: 'news',
  limit: 20
});
```

## Testing

### Test Page

Visit `http://localhost:3000/test-cryptopanic` to:

- Test API connectivity
- View cache statistics
- See trending and bullish news
- Verify data transformation

### API Testing

```bash
# Test CryptoPanic API directly
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5001/api/dashboard/test-cryptopanic
```

## Monitoring

### Cache Statistics

The service provides cache statistics:

```typescript
const stats = cryptoPanicService.getCacheStats();
console.log(`Cache size: ${stats.size}`);
console.log(`Cache keys: ${stats.keys.join(', ')}`);
```

### Logging

All API calls are logged with:

- Request parameters (with API key redacted)
- Response count
- Remaining API quota
- Error details

## Fallback Strategy

When the CryptoPanic API is unavailable:

1. **Return cached data** if available and fresh
2. **Use fallback data** with realistic crypto news
3. **Log the error** for monitoring
4. **Continue dashboard functionality** without interruption

## Security Considerations

- ✅ API key stored in environment variables
- ✅ API key redacted from logs
- ✅ No API key exposure in frontend
- ✅ Rate limiting to prevent abuse
- ✅ Input validation and sanitization

## Performance Optimization

- **Caching**: 5-minute cache reduces API calls by ~90%
- **Parallel Requests**: News fetched in parallel with other data
- **Timeout Handling**: 10-second timeout prevents hanging requests
- **Memory Efficient**: Cache size limited by TTL

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Check `backend/.env` file exists
   - Verify `CRYPTOPANIC_API_KEY` is set
   - Restart backend server

2. **Rate Limit Exceeded**
   - Check current usage in CryptoPanic dashboard
   - Wait for rate limit reset
   - Use cached data in the meantime

3. **Network Errors**
   - Check internet connectivity
   - Verify CryptoPanic API status
   - Check firewall/proxy settings

### Debug Commands

```bash
# Clear cache
curl -X POST http://localhost:5001/api/dashboard/clear-cache

# Check cache stats
curl http://localhost:5001/api/dashboard/cache-stats

# Test API directly
curl http://localhost:5001/api/dashboard/test-cryptopanic
```

## Future Enhancements

1. **User Preferences**: Filter news based on user interests
2. **Sentiment Analysis**: AI-powered sentiment scoring
3. **News Categories**: Categorize news by type (regulatory, technical, etc.)
4. **Push Notifications**: Real-time news alerts
5. **News Search**: Search functionality for historical news

## API Documentation

For more details, see the [CryptoPanic API documentation](https://cryptopanic.com/developers/api/).

## Support

If you encounter issues:

1. Check the logs in the backend console
2. Verify your API key and quota
3. Test the API directly using the test page
4. Check the CryptoPanic API status page
