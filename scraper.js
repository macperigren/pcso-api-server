// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.pcso.gov.ph';

let cachedResults = null;
let lastFetched = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchLatestResults(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && cachedResults && (now - lastFetched < CACHE_DURATION)) {
    console.log('🔁 Returning cached results');
    return cachedResults;
  }

  console.log('🌐 Fetching fresh results from PCSO...');
  try {
    const { data } = await axios.get(`${URL}/Pages/Lotto-Results.aspx`);
    const $ = cheerio.load(data);
    const results = [];

    $('.result-card').each((_, element) => {
      const game = $(element).find('.result-card-title').text().trim();
      const date = $(element).find('.result-card-date').text().trim();
      const numbers = $(element).find('.result-number')
        .map((_, el) => $(el).text().trim())
        .get();

      const jackpot = $(element).find('.result-card-prize').text().trim().replace(/\s+/g, ' ');

      if (game && numbers.length) {
        results.push({ game, date, numbers, jackpot });
      }
    });

    cachedResults = results;
    lastFetched = now;
    return results;
  } catch (err) {
    console.error('Failed to fetch lotto results:', err);
    if (cachedResults) {
      console.warn('⚠️ Returning stale cached data due to error');
      return cachedResults; // fallback
    }
    throw err;
  }
}

module.exports = { fetchLatestResults };
