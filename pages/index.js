import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', fontWeight:'900', fontFamily:'sans-serif'}}>SYNCING LEDGER...</div>;

  const latest = data.history?.[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;
  const stocks = data.holdings.filter(s => s.Ticker !== 'CASH');
  const cashValue = data.holdings.find(s => s.Ticker === 'CASH')?.['Current Price'] || 0;

  return (
    <div className="app-container">
      <style>{`
        body { margin: 0; background-color: #fcfcfd; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; }
        .app-container { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
        nav { margin-bottom: 60px; }
        h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; border-bottom: 6px solid #0f172a; display: inline-block; padding-bottom: 4px; margin: 0; }
        .hero { margin-bottom: 80px; }
        .label { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
        .total-val { font-size: clamp(60px, 12vw, 120px); font-weight: 900; letter-spacing: -6px; line-height: 0.9; margin: 0; }
        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        @media (max-width: 768px) { .dashboard-grid { grid-template-columns: 1fr; } }
        .card { background: white; border-radius: 40px; border: 1px solid #f1f5f9; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
        .cash-card { background: #0f172a; color: white; display: flex; flex-direction: column; justify-content: space-between; }
        .stock-row { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; border-bottom: 1px solid #f8fafc; }
        .stock-row:last-child { border: none; }
        .ticker { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; margin: 0; }
        .stock-name { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .price { font-size: 20px; font-weight: 700; margin: 0; }
        .gain { font-size: 12px; font-weight: 900; color: #10b981; }
        .loss { color: #f43f5e; }
        .buying-power { font-size: 48px; font-weight: 900; letter-spacing: -2px; margin: 0; }
        .status-tag { display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-top: 40px; }
        .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>

      <nav><h1>The Editorial Ledger</h1></nav>

      <main>
        <div className="hero">
          <p className="label">Portfolio Liquidity</p>
          <h2 className="total-val">${Number(totalValue).toLocaleString()}</h2>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <p className="label">Asset Distribution</p>
            {stocks.map((s, i) => (
              <div key={i} className="stock-row">
                <div>
                  <p className="ticker">{s.Ticker}</p>
                  <p className="stock-name">{s.Name}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p className="price">${Number(s['Current Price']).toLocaleString()}</p>
                  <p className={`gain ${s['Total Gain %'] < 0 ? 'loss' : ''}`}>
                    {s['Total Gain %'] >= 0 ? '▲' : '▼'} {Math.abs(s['Total Gain %'] * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="card cash-card">
            <div>
              <p className="label" style={{color: '#475569'}}>Buying Power</p>
              <p className="buying-power">${Number(cashValue).toLocaleString()}</p>
            </div>
            <div className="status-tag">
              <div className="dot"></div>
              <span>Live Connection</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
