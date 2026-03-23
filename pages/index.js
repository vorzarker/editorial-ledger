import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

// PASTE YOUR GOOGLE DEPLOYMENT URL HERE
const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

// THE COMPONENT: One blueprint for all stock rows
const StockRow = ({ ticker, name, price, gain }) => (
  <div className="flex justify-between items-center py-5 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-lg font-extrabold tracking-tight">{ticker}</p>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{name}</p>
    </div>
    <div className="text-right">
      <p className="text-lg font-bold">${Number(price).toLocaleString()}</p>
      <p className={`text-xs font-black ${(gain >= 0) ? 'text-emerald-600' : 'text-rose-600'}`}>
        {gain >= 0 ? '▲' : '▼'} {Math.abs(gain).toFixed(1)}%
      </p>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center font-black animate-pulse">SYNCING LEDGER...</div>;

  const latest = data.history[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans p-6 md:p-12">
      <header className="max-w-4xl mx-auto mb-16 flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter uppercase border-b-4 border-slate-900 pb-1">The Editorial Ledger</h1>
        <Wallet className="text-slate-300" />
      </header>

      <main className="max-w-4xl mx-auto space-y-20">
        {/* HERO SECTION */}
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Portfolio Liquidity</p>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
            ${Number(totalValue).toLocaleString()}
          </h2>
          <div className="flex gap-4 items-center">
             <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full uppercase tracking-widest">Live Status</span>
          </div>
        </section>

        {/* HOLDINGS SECTION - The "Loop" */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Asset Distribution</h3>
          <div>
            {data.holdings.map((item, index) => (
              <StockRow 
                key={index}
                ticker={item.Ticker}
                name={item.Name}
                price={item['Current Price']}
                gain={item['Total Gain %'] * 100}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
