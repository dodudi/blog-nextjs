'use server';

import {prisma} from '@/lib/db';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

interface PostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

export async function createPost(data: PostData) {
    await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            category: data.category,
            tags: data.tags,
            image: data.image,
            date: data.date,
        },
    });
    revalidatePath('/');
    redirect('/');
}

export async function updatePost(id: string, data: PostData) {
    await prisma.post.update({
        where: {id},
        data: {
            title: data.title,
            content: data.content,
            category: data.category,
            tags: data.tags,
            image: data.image,
            date: data.date,
        },
    });
    revalidatePath('/');
    revalidatePath(`/post/${id}`);
    redirect(`/post/${id}`);
}

export async function deletePost(id: string) {
    await prisma.post.delete({where: {id}});
    revalidatePath('/');
    redirect('/');
}
