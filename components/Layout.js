import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#fcfcfd] text-[#0f172a] font-sans pb-20">
      <Head>
        <title>The Editorial Ledger</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </Head>
      <nav className="p-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-[900] tracking-tighter uppercase border-b-[6px] border-[#0f172a] inline-block">
          The Editorial Ledger
        </h1>
      </nav>
      <main className="max-w-5xl mx-auto px-10 pt-10">
        {children}
      </main>
    </div>
  );
}
