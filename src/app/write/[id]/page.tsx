import {notFound} from 'next/navigation';
import {prisma} from '@/lib/db';
import WriteForm from '@/components/editor/WriteForm';
import {Category} from '@/types';

export default async function EditPage({
                                           params,
                                       }: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;

    const [post, dbCategories] = await Promise.all([
        prisma.post.findUnique({where: {id}}),
        prisma.category.findMany({orderBy: {createdAt: 'asc'}}),
    ]);

    if (!post) notFound();

    const categories: Category[] = dbCategories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    return (
        <div className="mx-auto max-w-[680px] px-4 py-6 sm:py-10">
            <WriteForm
                categories={categories}
                postId={post.id}
                defaultValues={{
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    tags: post.tags,
                    image: post.image,
                    date: post.date,
                }}
            />
        </div>
    );
}
