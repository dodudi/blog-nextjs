import PostFeed from '@/components/post/PostFeed';
import DraftBanner from '@/components/editor/DraftBanner';
import ProfileCard from '@/components/layout/ProfileCard';
import {postService} from '@/lib/services/postService';
import {categoryService} from '@/lib/services/categoryService';
import {draftService} from '@/lib/services/draftService';
import {auth} from '@/auth';

export const revalidate = 0;

export default async function HomePage() {
    const session = await auth();
    const isAdmin = !!session?.user;

    const [posts, categories, draft] = await Promise.all([
        postService.getAll(),
        categoryService.getAll(),
        isAdmin ? draftService.get() : Promise.resolve(null),
    ]);

    const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();

    return (
        <div className="mx-auto max-w-[1000px] px-4 py-6 sm:py-10">
            {isAdmin && draft && <DraftBanner/>}
            <div className="flex gap-8">
                <aside className="hidden lg:block w-[240px] shrink-0">
                    <ProfileCard/>
                </aside>
                <div className="flex-1 min-w-0">
                    <PostFeed posts={posts} categories={categories} allTags={allTags}/>
                </div>
            </div>
        </div>
    );
}
