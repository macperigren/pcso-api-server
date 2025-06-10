// scraper.js
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.pcso.gov.ph';

async function fetchLatestResults() {
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

    return results;
  } catch (err) {
    console.error('Failed to fetch lotto results:', err);
    throw err;
  }
}

module.exports = { fetchLatestResults };
