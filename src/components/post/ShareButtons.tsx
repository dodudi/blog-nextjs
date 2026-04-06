'use client';

import {useState} from 'react';

interface Props {
    title: string;
}

function ShareLink({href, label, children}: {href: string; label: string; children: React.ReactNode}) {
    function handleClick() {
        const url = window.location.href;
        window.open(href.replace('__URL__', encodeURIComponent(url)), '_blank', 'noopener,noreferrer');
    }

    return (
        <button
            onClick={handleClick}
            aria-label={label}
            className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
        >
            {children}
        </button>
    );
}

export default function ShareButtons({title}: Props) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    const encodedTitle = encodeURIComponent(title);

    return (
        <section className="mt-12 border-t border-zinc-100 pt-6">
            <p className="text-xs text-zinc-400 mb-3">이 글이 도움이 됐다면 공유해보세요</p>
            <div className="flex flex-wrap items-center gap-2">
                <button
                    onClick={handleCopy}
                    aria-label="URL 클립보드에 복사"
                    className="flex items-center gap-1.5 rounded-md border border-zinc-200 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
                >
                    {copied ? (
                        <>
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5"/>
                            </svg>
                            복사됨
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                            </svg>
                            URL 복사
                        </>
                    )}
                </button>

                <ShareLink
                    href={`https://x.com/intent/tweet?text=${encodedTitle}&url=__URL__`}
                    label="X(트위터)에 공유"
                >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-current">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X에 공유
                </ShareLink>

                <ShareLink
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=__URL__`}
                    label="LinkedIn에 공유"
                >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-current">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </ShareLink>

                <ShareLink
                    href={`https://www.reddit.com/submit?url=__URL__&title=${encodedTitle}`}
                    label="Reddit에 공유"
                >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-current">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                    </svg>
                    Reddit
                </ShareLink>
            </div>
        </section>
    );
}
