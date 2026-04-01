import WriteForm from '@/components/editor/WriteForm';
import {categoryService} from '@/lib/services/categoryService';
import {draftService} from '@/lib/services/draftService';

export const dynamic = 'force-dynamic';

export default async function WritePage() {
    const [categories, draft] = await Promise.all([
        categoryService.getAll(),
        draftService.get(),
    ]);

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
