import PostFeed from '@/components/post/PostFeed';
import DraftBanner from '@/components/editor/DraftBanner';
import {postService} from '@/lib/services/postService';
import {categoryService} from '@/lib/services/categoryService';
import {draftService} from '@/lib/services/draftService';

export const revalidate = 0;

export default async function HomePage() {
    const [posts, categories, draft] = await Promise.all([
        postService.getAll(),
        categoryService.getAll(),
        draftService.get(),
    ]);

    const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

    return (
        <div className="mx-auto max-w-[720px] px-4 py-6 sm:py-10">
            {draft && <DraftBanner/>}
            <PostFeed posts={posts} categories={categories} allTags={allTags}/>
        </div>
    );
}
