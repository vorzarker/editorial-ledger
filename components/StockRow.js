export default function StockRow({ stock }) {
  const gain = (stock['Total Gain %'] * 100).toFixed(1);
  return (
    <div className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors px-6 -mx-6 rounded-2xl group">
      <div>
        <p className="font-[900] text-2xl tracking-tighter group-hover:translate-x-1 transition-transform uppercase">{stock.Ticker}</p>
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
}
