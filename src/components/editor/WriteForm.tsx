'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import dynamic from 'next/dynamic';
import {Category} from '@/types';
import {createPost} from '@/lib/actions/posts';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import {readingTime} from '@/lib/readingTime';

const MilkdownEditor = dynamic(() => import('./MilkdownEditor'), {ssr: false});

interface DefaultValues {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

interface Props {
    categories: Category[];
    defaultValues?: DefaultValues;
}

export default function WriteForm({categories, defaultValues}: Props) {
    const today = new Date().toISOString().slice(0, 10);

    const [title, setTitle] = useState(defaultValues?.title ?? '');
    const [content, setContent] = useState(defaultValues?.content ?? '');
    const [category, setCategory] = useState(defaultValues?.category ?? '');
    const [tags, setTags] = useState<string[]>(defaultValues?.tags ?? []);
    const [tagInput, setTagInput] = useState('');
    const [image, setImage] = useState<string | null>(defaultValues?.image ?? null);
    const [date, setDate] = useState(defaultValues?.date ?? today);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [draftStatus, setDraftStatus] = useState<'saved' | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // FR-07 자동 임시저장
    const scheduleDraftSave = useCallback(() => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
            try {
                const res = await fetch('/api/draft', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({title, content, category, tags, image}),
                });
                if (res.ok) {
                    setDraftStatus('saved');
                    setTimeout(() => setDraftStatus(null), 2000);
                }
            } catch {
                // silent fail
            }
        }, 2000);
    }, [title, content, category, tags, image]);

    useEffect(() => {
        scheduleDraftSave();
        return () => {
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        };
    }, [scheduleDraftSave]);

    function addTag() {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setTagInput('');
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
    }

    async function handleSubmit() {
        if (!title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
            saveTimerRef.current = null;
        }
        setError('');
        setLoading(true);

        try {
            await fetch('/api/draft', {method: 'DELETE'}).catch(() => {});
            await createPost({title: title.trim(), content, category, tags, image, date});
        } catch {
            setLoading(false);
        }
    }

    const charCount = content.replace(/\s+/g, '').length;
    const minutes = readingTime(content);

    return (
        <div className="space-y-5">
            {/* 제목 */}
            <input
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl sm:text-2xl font-bold text-zinc-900 placeholder-zinc-300 border-none outline-none"
                aria-label="제목"
            />

            {/* 메타데이터 */}
            <div className="flex flex-wrap gap-3 pb-4 border-b border-zinc-100">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-sm border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-700 outline-none focus:border-zinc-400"
                    aria-label="카테고리"
                >
                    <option value="">카테고리 선택</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-sm border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-700 outline-none focus:border-zinc-400"
                    aria-label="날짜"
                />

                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-sm border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-600 hover:bg-zinc-50 transition-colors"
                    aria-label="대표 이미지 업로드"
                >
                    {image ? '이미지 변경' : '이미지 추가'}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    aria-label="이미지 파일 선택"
                />
                {image && (
                    <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label="이미지 삭제"
                    >
                        이미지 삭제
                    </button>
                )}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1">
                        <TagBadge tag={tag}/>
                        <button
                            onClick={() => setTags(tags.filter((t) => t !== tag))}
                            className="text-zinc-400 hover:text-red-500 text-xs leading-none"
                            aria-label={`${tag} 태그 삭제`}
                        >×</button>
                    </span>
                ))}
                <input
                    type="text"
                    placeholder="태그 입력 후 Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                    className="text-sm outline-none text-zinc-700 placeholder-zinc-300 min-w-[140px]"
                    aria-label="태그 입력"
                />
                {tagInput.trim() && (
                    <button
                        type="button"
                        onClick={addTag}
                        className="text-xs text-zinc-500 hover:text-zinc-900"
                    >
                        추가
                    </button>
                )}
            </div>

            {/* FR-07 임시저장 상태 */}
            {draftStatus === 'saved' && (
                <p className="text-xs text-zinc-400">✓ 임시저장됨</p>
            )}

            {/* Milkdown 에디터 */}
            <div aria-label="본문 내용">
                <MilkdownEditor
                    defaultValue={defaultValues?.content ?? ''}
                    onChange={setContent}
                />
            </div>

            {/* 글자 수 / 읽기 시간 */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{charCount.toLocaleString()}자 · 약 {minutes}분 읽기</span>
                {image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={image} alt="미리보기" className="w-10 h-10 object-cover rounded-md"/>
                )}
            </div>

            {/* 오류 메시지 */}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => window.history.back()}
                    disabled={loading}
                >
                    취소
                </Button>
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                    {loading ? '저장 중...' : '게시하기'}
                </Button>
            </div>
        </div>
    );
}
