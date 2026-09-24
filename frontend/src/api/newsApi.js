import { newsSentiment } from '../mock/database';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const newsApi = {
  getNews: async (symbol = null) => {
    await sleep(300);
    if (!symbol) {
      return [...newsSentiment];
    }
    const sym = symbol.toUpperCase();
    return newsSentiment.filter(article => article.stock === sym || article.stock === 'ALL');
  },

  getSentimentSummary: async (symbol = null) => {
    await sleep(200);
    const articles = await newsApi.getNews(symbol);
    const count = articles.length;
    if (count === 0) return { positive: 50, neutral: 50, negative: 0 };

    const pos = articles.filter(a => a.sentiment === 'Positive').length;
    const neu = articles.filter(a => a.sentiment === 'Neutral').length;
    const neg = articles.filter(a => a.sentiment === 'Negative').length;

    return {
      positive: Math.round((pos / count) * 100),
      neutral: Math.round((neu / count) * 100),
      negative: Math.round((neg / count) * 100)
    };
  }
};
