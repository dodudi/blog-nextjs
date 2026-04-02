import {prisma} from '@/lib/db';
import {Draft} from '@/types';

export interface DraftInput {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
}

function mapDraft(d: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    savedAt: Date;
}): Draft {
    return {
        title: d.title,
        content: d.content,
        category: d.category,
        tags: d.tags,
        image: d.image ?? null,
        savedAt: d.savedAt.toISOString(),
    };
}

export const draftRepository = {
    async find(): Promise<Draft | null> {
        const row = await prisma.draft.findUnique({where: {id: 'draft'}});
        return row ? mapDraft(row) : null;
    },

    async save(data: DraftInput): Promise<Draft> {
        const row = await prisma.draft.upsert({
            where: {id: 'draft'},
            update: {...data, savedAt: new Date()},
            create: {id: 'draft', ...data},
        });
        return mapDraft(row);
    },

    async remove(): Promise<void> {
        await prisma.draft.deleteMany({where: {id: 'draft'}});
    },
};
