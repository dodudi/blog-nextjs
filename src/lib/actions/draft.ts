'use server';

import {prisma} from '@/lib/db';
import {revalidatePath} from 'next/cache';

interface DraftData {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
}

export async function saveDraft(data: DraftData) {
    await prisma.draft.upsert({
        where: {id: 'draft'},
        update: {...data, savedAt: new Date()},
        create: {id: 'draft', ...data},
    });
}

export async function deleteDraft() {
    await prisma.draft.deleteMany({where: {id: 'draft'}});
    revalidatePath('/');
}
