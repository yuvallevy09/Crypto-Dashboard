require('dotenv').config();

console.log('🔍 Testing CryptoPanic Service...\n');

// Test environment variables
console.log('Environment variables:');
console.log('CRYPTOPANIC_API_KEY:', process.env.CRYPTOPANIC_API_KEY ? 'SET' : 'NOT SET');

// Test the service directly
const { cryptoPanicService } = require('./src/services/cryptoPanicService');

async function testService() {
  try {
    console.log('\n🧪 Testing service methods...');
    
    // Test getTrendingNews
    console.log('Testing getTrendingNews...');
    const trendingNews = await cryptoPanicService.getTrendingNews(3);
    console.log('✅ getTrendingNews result:', trendingNews.length, 'items');
    
    if (trendingNews.length > 0) {
      console.log('First item:', {
        title: trendingNews[0].title,
        source: trendingNews[0].source,
        dataSource: trendingNews[0].dataSource
      });
    }

    // Test cache stats
    const cacheStats = cryptoPanicService.getCacheStats();
    console.log('Cache stats:', cacheStats);

  } catch (error) {
    console.error('❌ Service test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testService();
