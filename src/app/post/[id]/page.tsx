import {notFound} from 'next/navigation';
import Link from 'next/link';
import {prisma} from '@/lib/db';
import PostContent from '@/components/post/PostContent';
import TagBadge from '@/components/ui/TagBadge';
import Button from '@/components/ui/Button';
import DeleteButton from './DeleteButton';
import {readingTime} from '@/lib/readingTime';

export default async function PostPage({
                                           params,
                                       }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    const post = await prisma.post.findUnique({where: {id}});
    if (!post) notFound();

    const minutes = readingTime(post.content);

    return (
        <article className="mx-auto max-w-[680px] px-4 py-6 sm:py-10">
            {/* FR-11: 카테고리 → 읽기 예상 시간 → 제목 → 작성일 → 태그 */}
            <header className="mb-8 sm:mb-10 space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    {post.category && <span>{post.category}</span>}
                    {post.category && <span>·</span>}
                    <span>{minutes}분 읽기</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-snug text-zinc-900">
                    {post.title}
                </h1>
                <p className="text-sm text-zinc-400">{post.date}</p>
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag}/>
                        ))}
                    </div>
                )}
            </header>

            {/* FR-10: 본문 렌더링 */}
            <PostContent content={post.content}/>

            {/* FR-12: 수정 / 삭제 */}
            <footer className="mt-16 flex justify-end gap-3 border-t border-zinc-100 pt-6">
                <DeleteButton id={post.id}/>
                <Link href={`/write/${post.id}`}>
                    <Button variant="secondary">수정</Button>
                </Link>
            </footer>
        </article>
    );
}
