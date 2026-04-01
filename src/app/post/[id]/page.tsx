import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {prisma} from '@/lib/db';
import {Post, Category} from '@/types';
import {summarize} from '@/lib/readingTime';
import PostDetailWrapper from './PostDetailWrapper';

export const revalidate = 0;

export async function generateMetadata({
    params,
}: {
    params: Promise<{id: string}>;
}): Promise<Metadata> {
    const {id} = await params;
    const post = await prisma.post.findUnique({where: {id}});
    if (!post) return {};

    const description = summarize(post.content).slice(0, 160);

    return {
        title: post.title,
        description,
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            tags: post.tags,
            ...(post.image ? {images: [{url: post.image}]} : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            ...(post.image ? {images: [post.image]} : {}),
        },
    };
}

export async function generateStaticParams() {
    const posts = await prisma.post.findMany({select: {id: true}});
    return posts.map((p) => ({id: p.id}));
}

export default async function PostPage({
    params,
}: {
    params: Promise<{id: string}>;
}) {
    const {id} = await params;

    const [dbPost, dbCategories] = await Promise.all([
        prisma.post.findUnique({where: {id}}),
        prisma.category.findMany({orderBy: {createdAt: 'asc'}}),
    ]);

    if (!dbPost) notFound();

    const post: Post = {
        ...dbPost,
        image: dbPost.image ?? null,
        createdAt: dbPost.createdAt.toISOString(),
        updatedAt: dbPost.updatedAt.toISOString(),
    };

    const categories: Category[] = dbCategories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    return <PostDetailWrapper post={post} categories={categories}/>;
}
