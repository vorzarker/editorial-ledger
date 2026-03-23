import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* This is the design engine. Putting it here makes it un-breakable. */}
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
        <style>{`
          body { 
            font-family: 'Inter', sans-serif; 
            background-color: #fcfcfd; 
            color: #0f172a;
            -webkit-font-smoothing: antialiased;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
