'use client';

import {useState} from 'react';
import {Category} from '@/types';
import Button from '@/components/ui/Button';

interface Props {
    initialCategories: Category[];
}

export default function CategoryManager({initialCategories}: Props) {
    const [categories, setCategories] = useState(initialCategories);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleAdd() {
        const name = input.trim();
        if (!name) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name}),
            });
            const body = await res.json();
            if (!res.ok) {
                setError(body.error?.message ?? '카테고리 추가에 실패했습니다.');
                return;
            }
            setCategories((prev) => [...prev, body.data]);
            setInput('');
        } catch {
            setError('카테고리 추가에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        setDeletingId(id);
        setError(null);
        try {
            const res = await fetch(`/api/categories/${id}`, {method: 'DELETE'});
            if (!res.ok) {
                const body = await res.json();
                setError(body.error?.message ?? '카테고리 삭제에 실패했습니다.');
                return;
            }
            setCategories((prev) => prev.filter((c) => c.id !== id));
        } catch {
            setError('카테고리 삭제에 실패했습니다.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAdd();
                    }}
                    placeholder="카테고리 이름 입력"
                    className="flex-1 border border-zinc-200 rounded-md px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-400 transition-colors"
                    aria-label="카테고리 이름"
                />
                <Button onClick={handleAdd} disabled={loading} aria-label="카테고리 추가">
                    {loading ? '추가 중...' : '추가'}
                </Button>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <ul className="space-y-2">
                {categories.length === 0 && (
                    <p className="text-sm text-zinc-400">등록된 카테고리가 없습니다.</p>
                )}
                {categories.map((c) => (
                    <li
                        key={c.id}
                        className="flex items-center justify-between rounded-md border border-zinc-100 px-4 py-2.5"
                    >
                        <span className="text-sm text-zinc-800">{c.name}</span>
                        <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                            className="text-zinc-400 hover:text-red-500 transition-colors text-lg leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label={`${c.name} 카테고리 삭제`}
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
