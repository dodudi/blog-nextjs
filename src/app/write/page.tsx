import {prisma} from '@/lib/db';
import WriteForm from '@/components/editor/WriteForm';
import {Category} from '@/types';

export const dynamic = 'force-dynamic';

export default async function WritePage() {
    const [dbCategories, draft] = await Promise.all([
        prisma.category.findMany({orderBy: {createdAt: 'asc'}}),
        prisma.draft.findUnique({where: {id: 'draft'}}),
    ]);

    const categories: Category[] = dbCategories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
    }));

    const draftValues = draft
        ? {
            title: draft.title,
            content: draft.content,
            category: draft.category,
            tags: draft.tags,
            image: draft.image,
            date: new Date().toISOString().slice(0, 10),
        }
        : undefined;

    return (
        <div className="mx-auto max-w-[680px] px-4 py-6 sm:py-10">
            <WriteForm categories={categories} defaultValues={draftValues}/>
        </div>
    );
}
