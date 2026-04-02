'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {postService} from '@/lib/services/postService';
import {requireAdminPage} from '@/lib/auth';

interface PostData {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

export async function createPost(data: PostData) {
    await requireAdminPage();
    await postService.create(data);
    revalidatePath('/');
    redirect('/');
}

export async function deletePost(id: string) {
    await requireAdminPage();
    await postService.delete(id);
    revalidatePath('/');
    redirect('/');
}
