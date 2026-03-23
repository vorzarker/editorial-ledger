import React, { useState, useEffect, dynamic } from 'react';
import Head from 'next/head';
import { Wallet, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

// This is the fix: It tells the chart to only load once it's in the browser
const DynamicAreaChart = typeof window !== 'undefined' ? require('recharts').AreaChart : null;
const DynamicArea = typeof window !== 'undefined' ? require('recharts').Area : null;
const DynamicContainer = typeof window !== 'undefined' ? require('recharts').ResponsiveContainer : null;

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data || !mounted) return (
    <div className="flex h-screen items-center justify-center bg-[#fcfcfd]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-slate-400" size={32} />
        <span className="font-black text-slate-400 uppercase tracking-tighter">Syncing Ledger...</span>
      </div>
    </div>
  );

  const latest = data.history[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;
  const dailyChange = (latest['Daily Change %'] || 0) * 100;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20 font-sans">
      <Head>
        <title>The Editorial Ledger</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </Head>

      <nav className="p-8 max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-black tracking-tighter uppercase border-b-4 border-slate-900">The Editorial Ledger</h1>
      </nav>

      <main className="max-w-5xl mx-auto px-8 space-y-16 pt-10">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Portfolio Liquidity</p>
            <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              ${Number(totalValue).toLocaleString()}
            </h2>
            <div className={`flex items-center gap-2 font-bold ${dailyChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {dailyChange >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              <span>{dailyChange.toFixed(2)}% Performance Today</span>
            </div>
          </div>

          <div className="h-40 w-full bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            {DynamicContainer && (
              <DynamicContainer width="100%" height="100%">
                <DynamicAreaChart data={data.history}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <DynamicArea type="monotone" dataKey="Total Value" stroke="#0f172a" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </DynamicAreaChart>
              </DynamicContainer>
            )}
          </div>
        </section>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
            <Wallet size={14} /> Asset Distribution
          </h3>
          <div className="space-y-2">
            {data.holdings.map((stock, i) => (
              <div key={i} className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-4 -mx-4 rounded-xl">
                <div>
                  <p className="font-extrabold text-xl tracking-tight">{stock.Ticker}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stock.Name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">${Number(stock['Current Price']).toLocaleString()}</p>
                  <p className={`text-xs font-black ${(stock['Total Gain %'] * 100) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {(stock['Total Gain %'] * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
