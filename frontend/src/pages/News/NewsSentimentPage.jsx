import React, { useState, useEffect } from 'react';
import { newsApi } from '../../api/newsApi';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { Newspaper, HelpCircle, CheckCircle, MessageSquare } from 'lucide-react';

const NewsSentimentPage = () => {
  const [news, setNews] = useState([]);
  const [sentimentSummary, setSentimentSummary] = useState(null);
  const [selectedStock, setSelectedStock] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const filters = ['ALL', 'TCS', 'INFY', 'RELIANCE', 'SBIN', 'HDFCBANK'];

  const loadNewsData = async () => {
    setLoading(true);
    try {
      const symbolFilter = selectedStock === 'ALL' ? null : selectedStock;
      const articles = await newsApi.getNews(symbolFilter);
      setNews(articles);
      const summary = await newsApi.getSentimentSummary(symbolFilter);
      setSentimentSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsData();
  }, [selectedStock]);

  if (loading && news.length === 0) {
    return <SkeletonLoader type="table" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>News & NLP Sentiment</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Aggregated regulatory statements and news articles analyzed by sentiment indices.</p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setSelectedStock(f)}
              style={{
                background: selectedStock === f ? 'var(--accent-purple)' : 'transparent',
                color: selectedStock === f ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Sentiment Summary & Articles List */}
      <div className="responsive-split-2-1" style={{ alignItems: 'flex-start' }}>
        
        {/* Sentiment Index Ratios Card */}
        {sentimentSummary && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sentiment Summary</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Positive */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--bullish-green)' }}>Positive</span>
                  <span style={{ color: 'var(--text-primary)' }}>{sentimentSummary.positive}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-chip)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sentimentSummary.positive}%`, backgroundColor: 'var(--bullish-green)' }}></div>
                </div>
              </div>

              {/* Neutral */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Neutral</span>
                  <span style={{ color: 'var(--text-primary)' }}>{sentimentSummary.neutral}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-chip)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sentimentSummary.neutral}%`, backgroundColor: 'var(--text-muted)' }}></div>
                </div>
              </div>

              {/* Negative */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--bearish-red)' }}>Negative</span>
                  <span style={{ color: 'var(--text-primary)' }}>{sentimentSummary.negative}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-chip)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${sentimentSummary.negative}%`, backgroundColor: 'var(--bearish-red)' }}></div>
                </div>
              </div>

            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              <strong>NLP Analysis:</strong> Sentiment indexes are generated using pre-trained financial language models analyzing NLP articles. Score 70+ indicates optimistic signals.
            </div>
          </div>
        )}

        {/* Articles List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {news.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Newspaper size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px auto', opacity: 0.5 }} />
              <h3>No Articles Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try clearing filters or check back later.</p>
            </div>
          ) : (
            news.map((item) => (
              <div 
                key={item.id} 
                className="glass-card" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  borderLeft: `4px solid ${item.sentiment === 'Positive' ? 'var(--bullish-green)' : item.sentiment === 'Negative' ? 'var(--bearish-red)' : 'var(--text-muted)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <span className={item.sentiment === 'Positive' ? 'badge-bullish' : item.sentiment === 'Negative' ? 'badge-bearish' : 'badge-neutral'}>
                    {item.sentiment} ({item.score})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.4', margin: 0, color: 'var(--text-primary)' }}>
                  {item.headline}
                </h4>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <span>Source: <strong>{item.source}</strong></span>
                  <span style={{ backgroundColor: 'var(--bg-chip)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>{item.stock}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default NewsSentimentPage;
