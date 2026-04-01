import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: 'RudyNote',
        template: '%s | RudyNote',
    },
    description: '배우고, 경험하고, 나누고 싶은 것들을 기록하는 공간',
    openGraph: {
        type: 'website',
        siteName: 'RudyNote',
        locale: 'ko_KR',
        title: 'RudyNote',
        description: '배우고, 경험하고, 나누고 싶은 것들을 기록하는 공간',
        url: siteUrl,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RudyNote',
        description: '배우고, 경험하고, 나누고 싶은 것들을 기록하는 공간',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ko"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <Header/>
        <main className="flex-1">{children}</main>
        </body>
        </html>
    );
}
