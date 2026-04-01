'use client';

import {useRouter} from 'next/navigation';

export default function DraftBanner() {
    const router = useRouter();

    async function handleDismiss() {
        await fetch('/api/draft', {method: 'DELETE'});
        router.refresh();
    }

    return (
        <div className="mb-6 flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-sm text-zinc-700">작성 중인 글이 있습니다.</p>
            <div className="flex gap-2">
                <button
                    onClick={handleDismiss}
                    className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                    aria-label="임시저장 무시"
                >
                    무시
                </button>
                <button
                    onClick={() => router.push('/write')}
                    className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
                    aria-label="이어서 작성"
                >
                    이어서 작성
                </button>
            </div>
        </div>
    );
}
