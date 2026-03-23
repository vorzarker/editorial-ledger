import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-[#fcfcfd] font-black text-slate-300 animate-pulse">
      SYNCING LEDGER...
    </div>
  );

  const latest = data.history?.[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;
  const stocks = data.holdings.filter(s => s.Ticker !== 'CASH');
  const cashAsset = data.holdings.find(s => s.Ticker === 'CASH');

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#0f172a] p-6 md:p-12">
      <Head>
        <title>The Editorial Ledger</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </Head>

      <nav className="max-w-6xl mx-auto mb-16">
        <h1 className="text-2xl font-[900] tracking-tighter uppercase border-b-[6px] border-[#0f172a] inline-block">
          The Editorial Ledger
        </h1>
      </nav>

      <main className="max-w-6xl mx-auto">
        <header className="mb-20">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Portfolio Liquidity</p>
          <h2 className="text-7xl md:text-9xl font-[900] tracking-tighter leading-none">
            ${Number(totalValue).toLocaleString()}
          </h2>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ASSET LIST */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-10">Asset Distribution</h3>
            <div className="space-y-2">
              {stocks.map((stock, i) => {
                const gain = (stock['Total Gain %'] * 100).toFixed(1);
                return (
                  <div key={i} className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-6 -mx-6 rounded-2xl group">
                    <div>
                      <p className="font-[900] text-2xl tracking-tighter uppercase group-hover:translate-x-1 transition-transform">
                        {stock.Ticker}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stock.Name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl">${Number(stock['Current Price']).toLocaleString()}</p>
                      <p className={`text-xs font-black ${gain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {gain >= 0 ? '▲' : '▼'} {Math.abs(gain)}%
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BUYING POWER SIDEBAR */}
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10">Buying Power</h3>
              <p className="text-5xl font-black tracking-tighter">
                ${Number(cashAsset?.['Current Price'] || 0).toLocaleString()}
              </p>
            </div>
            <div className="mt-10 pt-10 border-t border-slate-800">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Sync Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-tighter">Live Connection</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
