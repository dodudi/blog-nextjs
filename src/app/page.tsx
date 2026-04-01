import {prisma} from '@/lib/db';
import PostFeed from '@/components/post/PostFeed';
import DraftBanner from '@/components/editor/DraftBanner';
import {Category, Post} from '@/types';

export const revalidate = 0;

export default async function HomePage() {
    const [dbPosts, dbCategories, draft] = await Promise.all([
        prisma.post.findMany({orderBy: {createdAt: 'desc'}}),
        prisma.category.findMany({orderBy: {createdAt: 'asc'}}),
        prisma.draft.findUnique({where: {id: 'draft'}}),
    ]);

    const posts: Post[] = dbPosts.map((p) => ({
        ...p,
        image: p.image ?? null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    }));

    const categories: Category[] = dbCategories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    const allTags = [...new Set(dbPosts.flatMap((p) => p.tags))].sort();

    return (
        <div className="mx-auto max-w-[720px] px-4 py-6 sm:py-10">
            {draft && <DraftBanner/>}
            <PostFeed posts={posts} categories={categories} allTags={allTags}/>
        </div>
    );
}
