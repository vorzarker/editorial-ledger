'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', backgroundColor:'#fcfcfd', color:'#94a3b8', fontWeight:'900', textTransform:'uppercase', letterSpacing:'-0.05em'}}>
      Syncing Ledger...
    </div>
  );

  const latest = data.history?.[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;
  const dailyChange = (latest['Daily Change %'] || 0) * 100;
  const stocks = data.holdings.filter(s => s.Ticker !== 'CASH');
  const cashValue = data.holdings.find(s => s.Ticker === 'CASH')?.['Current Price'] || 0;

  return (
    <div className="container">
      <Head>
        <title>The Editorial Ledger</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', sans-serif; background-color: #fcfcfd; color: #0f172a; -webkit-font-smoothing: antialiased; margin: 0; }
          .container { max-width: 1100px; margin: 0 auto; padding: 60px 40px; }
          .hero-value { font-size: clamp(64px, 12vw, 140px); font-weight: 900; letter-spacing: -0.07em; line-height: 0.85; margin: 20px 0; }
          .ticker-card { background: white; border-radius: 48px; border: 1px solid #f1f5f9; padding: 48px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02); }
          .cash-sidebar { background: #0f172a; color: white; border-radius: 48px; padding: 48px; display: flex; flex-direction: column; justify-content: space-between; min-height: 300px; }
        `}</style>
      </Head>

      <nav className="mb-24">
        <h1 className="text-2xl font-[900] tracking-tighter uppercase border-b-[6px] border-[#0f172a] inline-block">The Editorial Ledger</h1>
      </nav>

      <main>
        <header className="mb-20">
          <p className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.25em]">Portfolio Liquidity</p>
          <h2 className="hero-value">${Number(totalValue).toLocaleString()}</h2>
          <div className={`text-lg font-bold ${dailyChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {dailyChange >= 0 ? '▲' : '▼'} {Math.abs(dailyChange).toFixed(2)}% Performance Today
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main List */}
          <section className="lg:col-span-2 ticker-card">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-12">Asset Distribution</h3>
            <div className="divide-y divide-slate-50">
              {stocks.map((stock, i) => {
                const gain = (stock['Total Gain %'] * 100).toFixed(1);
                return (
                  <div key={i} className="flex justify-between items-center py-8 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-3xl font-[900] tracking-tighter uppercase">{stock.Ticker}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stock.Name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tracking-tight">${Number(stock['Current Price']).toLocaleString()}</p>
                      <p className={`text-xs font-black ${gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {gain >= 0 ? '+' : ''}{gain}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cash Sidebar */}
          <aside className="cash-sidebar shadow-2xl">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10">Buying Power</h3>
              <p className="text-6xl font-[900] tracking-tighter">${Number(cashValue).toLocaleString()}</p>
            </div>
            <div className="pt-10 border-t border-white/10">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Sync Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[11px] font-bold uppercase tracking-tight opacity-50">Live Connection</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
