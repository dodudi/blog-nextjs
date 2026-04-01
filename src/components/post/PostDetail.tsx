'use client';

import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Crepe, CrepeFeature} from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import {Category, Post} from '@/types';
import {deletePost} from '@/lib/actions/posts';
import TagBadge from '@/components/ui/TagBadge';
import Button from '@/components/ui/Button';
import {readingTime} from '@/lib/readingTime';

interface Props {
    post: Post;
    categories: Category[];
}

export default function PostDetail({post, categories}: Props) {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [category, setCategory] = useState(post.category);
    const [tags, setTags] = useState<string[]>(post.tags);
    const [tagInput, setTagInput] = useState('');
    const [date, setDate] = useState(post.date);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editorKey, setEditorKey] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);
    const contentRef = useRef(post.content);
    // 마지막으로 저장된 본문 — 취소·저장 후 에디터 재마운트 시 defaultValue로 사용
    const savedContentRef = useRef(post.content);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let destroyed = false;

        const crepe = new Crepe({
            root: container,
            defaultValue: savedContentRef.current,
            features: {
                [CrepeFeature.Toolbar]: false,
                [CrepeFeature.TopBar]: false,
                [CrepeFeature.Latex]: false,
            },
        });

        crepe.on((api) => {
            api.markdownUpdated((_, markdown) => {
                contentRef.current = markdown;
            });
        });

        crepe.create().then(() => {
            if (destroyed) return;
            crepe.setReadonly(true);
            crepeRef.current = crepe;
        }).catch(() => {
            // destroy()가 create() 완료 전에 호출되면(React StrictMode) 에러 무시
        });

        return () => {
            destroyed = true;
            crepe.destroy();
            crepeRef.current = null;
            container.innerHTML = '';
        };
    }, [editorKey]); // eslint-disable-line react-hooks/exhaustive-deps

    function handleEdit() {
        setIsEditing(true);
        crepeRef.current?.setReadonly(false);
    }

    function handleCancel() {
        setTitle(post.title);
        setCategory(post.category);
        setTags(post.tags);
        setDate(post.date);
        setTagInput('');
        setError(null);
        contentRef.current = savedContentRef.current;
        setIsEditing(false);
        setEditorKey((k) => k + 1);
    }

    async function handleSave() {
        if (!title.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    title: title.trim(),
                    content: contentRef.current,
                    category,
                    tags,
                    image: post.image,
                    date,
                }),
            });
            if (!res.ok) {
                const body = await res.json();
                setError(body.error?.message ?? '저장에 실패했습니다.');
                setLoading(false);
                return;
            }
            savedContentRef.current = contentRef.current;
            setEditorKey((k) => k + 1);
            setIsEditing(false);
            setLoading(false);
            router.refresh();
        } catch {
            setError('저장에 실패했습니다.');
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await deletePost(post.id);
    }

    function addTag() {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) setTags([...tags, t]);
        setTagInput('');
    }

    const minutes = readingTime(post.content);

    return (
        <article className="mx-auto max-w-[680px] px-4 py-6 sm:py-10">
            <header className="mb-8 space-y-3">
                {isEditing ? (
                    <>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목"
                            className="w-full text-2xl sm:text-3xl font-bold text-zinc-900 outline-none border-b border-zinc-200 pb-1"
                        />
                        <div className="flex flex-wrap gap-3 pb-3 border-b border-zinc-100">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="text-sm border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-700 outline-none focus:border-zinc-400"
                            >
                                <option value="">카테고리 없음</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="text-sm border border-zinc-200 rounded-md px-2 py-1.5 text-zinc-700 outline-none focus:border-zinc-400"
                            />
                        </div>
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
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            {category && <span>{category}</span>}
                            {category && <span>·</span>}
                            <span>{minutes}분 읽기</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-zinc-900">
                            {title}
                        </h1>
                        <p className="text-sm text-zinc-400">{date}</p>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {tags.map((tag) => <TagBadge key={tag} tag={tag}/>)}
                            </div>
                        )}
                    </>
                )}
            </header>

            <div
                key={editorKey}
                ref={containerRef}
                className={`milkdown-wrap${isEditing ? '' : ' milkdown-readonly'}`}
            />

            <footer className="mt-12 border-t border-zinc-100 pt-6 space-y-3">
                {error && <p className="text-sm text-red-500 text-right">{error}</p>}
                <div className="flex justify-end gap-3">
                    {isEditing ? (
                        <>
                            <Button variant="secondary" onClick={handleCancel} disabled={loading}>
                                취소
                            </Button>
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? '저장 중...' : '저장'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="danger" onClick={handleDelete}>삭제</Button>
                            <Button variant="secondary" onClick={handleEdit}>수정</Button>
                        </>
                    )}
                </div>
            </footer>
        </article>
    );
}
