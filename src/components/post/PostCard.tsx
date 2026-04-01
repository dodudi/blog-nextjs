import Link from 'next/link';
import {Post} from '@/types';
import TagBadge from '@/components/ui/TagBadge';
import {readingTime, summarize} from '@/lib/readingTime';
import {getHighlightParts} from '@/lib/highlight';

interface Props {
    post: Post;
    query?: string;
}

function Highlight({text, query}: { text: string; query?: string }) {
    if (!query?.trim()) return <>{text}</>;
    const parts = getHighlightParts(text, query);
    return (
        <>
            {parts.map((p, i) =>
                p.match ? (
                    <mark key={i} className="bg-yellow-200 text-inherit">
                        {p.text}
                    </mark>
                ) : (
                    p.text
                )
            )}
        </>
    );
}

export default function PostCard({post, query}: Props) {
    const minutes = readingTime(post.content);
    const summary = summarize(post.content);

    return (
        <Link
            href={`/post/${post.id}`}
            className="block rounded-md px-2 -mx-2 hover:bg-zinc-50 transition-colors"
        >
            <article className="flex items-start gap-4 py-5 border-b border-zinc-100">
                <div className="flex-1 min-w-0">
                    {post.category && (
                        <span className="text-xs font-medium text-zinc-400 mb-1 block">
              {post.category}
            </span>
                    )}
                    <h2 className="font-semibold text-zinc-900 text-base leading-snug line-clamp-2 mb-1">
                        <Highlight text={post.title} query={query}/>
                    </h2>
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-2">
                        <Highlight text={summary} query={query}/>
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {post.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag}/>
                        ))}
                        <span className="text-xs text-zinc-400 ml-auto shrink-0">
              {post.date} · {minutes}분
            </span>
                    </div>
                </div>
                {post.image && (
                    <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.image} alt="" className="w-full h-full object-cover"/>
                    </div>
                )}
            </article>
        </Link>
    );
}
