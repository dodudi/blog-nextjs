'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {postService} from '@/lib/services/postService';

interface PostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

export async function createPost(data: PostData) {
    await postService.create(data);
    revalidatePath('/');
    redirect('/');
}

export async function deletePost(id: string) {
    await postService.delete(id);
    revalidatePath('/');
    redirect('/');
}
