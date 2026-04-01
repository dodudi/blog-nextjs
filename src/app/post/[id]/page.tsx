import {cache} from 'react';
import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {summarize} from '@/lib/readingTime';
import {postService} from '@/lib/services/postService';
import {categoryService} from '@/lib/services/categoryService';
import {NotFoundError} from '@/lib/errors';
import PostDetailWrapper from './PostDetailWrapper';

export const revalidate = 0;

const getPost = cache((id: string) => postService.getById(id));

export async function generateMetadata({
    params,
}: {
    params: Promise<{id: string}>;
}): Promise<Metadata> {
    const {id} = await params;
    try {
        const post = await getPost(id);
        const description = summarize(post.content).slice(0, 160);

        return {
            title: post.title,
            description,
            openGraph: {
                title: post.title,
                description,
                type: 'article',
                publishedTime: post.createdAt,
                modifiedTime: post.updatedAt,
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
    } catch {
        return {};
    }
}

export default async function PostPage({
    params,
}: {
    params: Promise<{id: string}>;
}) {
    const {id} = await params;

    let post: Awaited<ReturnType<typeof getPost>>;
    let categories: Awaited<ReturnType<typeof categoryService.getAll>>;

    try {
        [post, categories] = await Promise.all([
            getPost(id),
            categoryService.getAll(),
        ]);
    } catch (e) {
        if (e instanceof NotFoundError) notFound();
        throw e;
    }

    return <PostDetailWrapper post={post} categories={categories}/>;
}
