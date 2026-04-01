'use server';

import {prisma} from '@/lib/db';
import {revalidatePath} from 'next/cache';

export async function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;

    await prisma.category.upsert({
        where: {name: trimmed},
        update: {},
        create: {name: trimmed},
    });
    revalidatePath('/settings/categories');
    revalidatePath('/write');
    revalidatePath('/');
}

export async function deleteCategory(id: string) {
    const category = await prisma.category.findUnique({where: {id}});
    if (!category) return;

    // FR-14 B: 해당 카테고리 사용 중인 글의 category를 빈 문자열로 초기화
    await prisma.post.updateMany({
        where: {category: category.name},
        data: {category: ''},
    });

    await prisma.category.delete({where: {id}});
    revalidatePath('/settings/categories');
    revalidatePath('/');
}
