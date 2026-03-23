'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Wallet, ArrowUpRight, ArrowDownRight, Loader2, PieChart as PieIcon } from 'lucide-react';

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [Charts, setCharts] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
    // Dynamically load charts only in the browser to prevent Vercel build errors
    import('recharts').then(setCharts);
  }, []);

  if (!data) return (
    <div className="flex h-screen items-center justify-center bg-[#fcfcfd]">
      <div className="flex flex-col items-center gap-4 text-slate-300">
        <Loader2 className="animate-spin" size={40} />
        <span className="font-black uppercase tracking-tighter">Syncing Ledger...</span>
      </div>
    </div>
  );

  const latest = data.history?.[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;
  const dailyChange = (latest['Daily Change %'] || 0) * 100;
  const stocks = data.holdings.filter(s => s.Ticker !== 'CASH');
  const cashValue = data.holdings.find(s => s.Ticker === 'CASH')?.['Current Price'] || 0;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#0f172a] p-6 md:p-12 font-sans selection:bg-slate-900 selection:text-white">
      <Head>
        <title>The Editorial Ledger</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </Head>

      <nav className="max-w-6xl mx-auto mb-16">
        <h1 className="text-2xl font-[900] tracking-tighter uppercase border-b-[6px] border-[#0f172a] inline-block">The Editorial Ledger</h1>
      </nav>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-2">
            <p className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em]">Net Worth Portfolio</p>
            <h2 className="text-8xl font-[900] tracking-tighter leading-none">${Number(totalValue).toLocaleString()}</h2>
            <div className={`flex items-center gap-2 font-bold ${dailyChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {dailyChange >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              <span className="text-lg">{dailyChange.toFixed(2)}% Performance Today</span>
            </div>
          </div>

          {/* GROWTH CHART */}
          <div className="h-48 w-full bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
            {Charts && (
              <Charts.ResponsiveContainer width="100%" height="100%">
                <Charts.AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Charts.Area type="monotone" dataKey="Total Value" stroke="#0f172a" fill="url(#colorVal)" strokeWidth={4} dot={false} />
                </Charts.AreaChart>
              </Charts.ResponsiveContainer>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ASSET LIST */}
          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-10">Asset Distribution</h3>
            <div className="space-y-1">
              {stocks.map((stock, i) => {
                const gain = (stock['Total Gain %'] * 100).toFixed(1);
                return (
                  <div key={i} className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-6 -mx-6 rounded-2xl group">
                    <div>
                      <p className="font-[900] text-2xl tracking-tighter uppercase group-hover:translate-x-1 transition-transform">{stock.Ticker}</p>
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
          <div className="bg-[#0f172a] text-white p-10 rounded-[3rem] shadow-xl flex flex-col justify-between border-t border-white/10">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10 flex items-center gap-2">
                <Wallet size={14} /> Buying Power
              </h3>
              <p className="text-6xl font-[900] tracking-tighter">${Number(cashValue).toLocaleString()}</p>
            </div>
            <div className="mt-10 pt-10 border-t border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">System Status</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-tighter opacity-60">Live Sheet Connection</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
