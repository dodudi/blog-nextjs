'use client';

import {useState} from 'react';
import {Category} from '@/types';
import {addCategory, deleteCategory} from '@/lib/actions/categories';
import Button from '@/components/ui/Button';

interface Props {
    initialCategories: Category[];
}

export default function CategoryManager({initialCategories}: Props) {
    const [categories, setCategories] = useState(initialCategories);
    const [input, setInput] = useState('');

    async function handleAdd() {
        const name = input.trim();
        if (!name) return;
        if (categories.some((c) => c.name === name)) {
            setInput('');
            return;
        }
        setInput('');
        await addCategory(name);
        setCategories((prev) => [
            ...prev,
            {id: Date.now().toString(), name, createdAt: new Date().toISOString()},
        ]);
    }

    async function handleDelete(id: string) {
        await deleteCategory(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
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
                <Button onClick={handleAdd} aria-label="카테고리 추가">
                    추가
                </Button>
            </div>

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
                            className="text-zinc-400 hover:text-red-500 transition-colors text-lg leading-none"
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
