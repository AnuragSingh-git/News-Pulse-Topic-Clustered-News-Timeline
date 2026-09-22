import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News Pulse — Topic Timeline',
  description: 'A visual timeline of the stories shaping the news cycle.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
