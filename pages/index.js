'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StockRow from '../components/StockRow';

const API_URL = "https://script.google.com/macros/s/AKfycbznNPnaMdxuHaXIy1fLj1sPvanpRLUcLPmsD7_35kR95_vtFHqDQH9DlJXSc9ujXhNp/exec";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(API_URL).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center font-black tracking-tighter text-slate-300 animate-pulse">SYNCING LEDGER...</div>;

  const latest = data.history?.[data.history.length - 1] || {};
  const totalValue = latest['Total Value'] || 0;

  // Separate regular stocks from Cash
  const stocks = data.holdings.filter(s => s.Ticker !== 'CASH');
  const cashAsset = data.holdings.find(s => s.Ticker === 'CASH');

  return (
    <Layout>
      <header className="mb-20">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center md:text-left">Portfolio Liquidity</p>
        <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none text-center md:text-left">
          ${Number(totalValue).toLocaleString()}
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Asset List */}
        <section className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-10">Asset Distribution</h3>
          <div className="space-y-2">
            {stocks.map((stock, i) => (
              <StockRow key={i} stock={stock} />
            ))}
          </div>
        </section>

        {/* Cash/Buying Power Sidebar */}
        <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-10">Buying Power</h3>
            <p className="text-5xl font-black tracking-tighter">${Number(cashAsset?.['Current Price'] || 0).toLocaleString()}</p>
          </div>
          <div className="mt-10 pt-10 border-t border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Live Status</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold">Systems Operational</span>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
