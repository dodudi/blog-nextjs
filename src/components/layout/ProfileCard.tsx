'use client';

import {useState} from 'react';

function CopyButton({text}: {text: string}) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <button
            onClick={handleCopy}
            aria-label="클립보드에 복사"
            className="ml-auto shrink-0 text-zinc-300 hover:text-zinc-600 transition-colors"
        >
            {copied ? (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
            )}
        </button>
    );
}

export default function ProfileCard() {
    return (
        <div className="sticky top-[4.5rem] rounded-xl border border-zinc-100 p-5 space-y-4">
            {/* 아바타 + 이름 */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xl font-semibold select-none">
                    R
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-zinc-900">Rudy</p>
                    <p className="text-xs text-zinc-400 mt-0.5">Software Developer</p>
                </div>
            </div>

            {/* 소개 */}
            <p className="text-xs text-zinc-500 leading-relaxed text-center">
                배우고 경험하고 나누고 싶은 것들을 기록합니다.
            </p>

            <hr className="border-zinc-100"/>

            {/* 링크 */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                    <a
                        href="https://github.com/dodudi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors min-w-0"
                    >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-current">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        <span className="truncate">github.com/dodudi</span>
                    </a>
                    <CopyButton text="https://github.com/dodudi"/>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="mailto:kdidado@gmail.com"
                        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-900 transition-colors min-w-0"
                    >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span className="truncate">kdidado@gmail.com</span>
                    </a>
                    <CopyButton text="kdidado@gmail.com"/>
                </div>
            </div>
        </div>
    );
}
