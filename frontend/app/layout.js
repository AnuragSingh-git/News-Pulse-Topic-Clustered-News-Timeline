import './globals.css';

export const metadata = {
  title: 'News Pulse — Topic-Clustered News Timeline',
  description: 'Live news articles grouped into topic clusters and plotted on a timeline.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-wire-bg text-wire-ink font-sans antialiased">{children}</body>
    </html>
  );
}
