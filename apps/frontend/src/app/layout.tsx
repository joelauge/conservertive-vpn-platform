import type { Metadata } from 'next';
import { Sora, Source_Code_Pro } from 'next/font/google';
import './globals.css';

const sora = Sora({ 
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-sora',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-source-code-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ConSERVERtive VPN - Combatting Censorship Worldwide',
  description: 'ConSERVERtive VPN provides secure, private internet access while fighting censorship globally. Pay for one account, sponsor a free user in a censored country.',
  keywords: 'VPN, censorship, internet freedom, privacy, security, anti-censorship',
  authors: [{ name: 'ConSERVERtive Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'ConSERVERtive VPN - Combatting Censorship Worldwide',
    description: 'ConSERVERtive VPN provides secure, private internet access while fighting censorship globally.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConSERVERtive VPN - Combatting Censorship Worldwide',
    description: 'ConSERVERtive VPN provides secure, private internet access while fighting censorship globally.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${sourceCodePro.variable} font-sans`}>{children}</body>
    </html>
  );
}
