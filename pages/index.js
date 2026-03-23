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

  if (!data) return <div className="p-20 font-black animate-pulse">SYNCING LEDGER...</div>;

  const latest = data.history?.[data.history.length - 1] || {};

  return (
    <Layout>
      <section className="mb-20">
        <p className="text-[11px] font-[900] text-slate-400 uppercase tracking-[0.2em] mb-4">Portfolio Liquidity</p>
        <h2 className="text-8xl font-[900] tracking-tighter leading-none">
          ${Number(latest['Total Value']).toLocaleString()}
        </h2>
      </section>

      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-[900] uppercase tracking-widest text-slate-400 mb-10">Asset Distribution</h3>
        <div className="space-y-2">
          {data.holdings.map((stock, i) => (
            <StockRow key={i} stock={stock} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
