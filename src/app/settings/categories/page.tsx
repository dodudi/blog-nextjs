import CategoryManager from '@/components/settings/CategoryManager';
import {categoryService} from '@/lib/services/categoryService';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const categories = await categoryService.getAll();

    return (
        <div className="mx-auto max-w-[680px] px-4 py-6 sm:py-10">
            <h1 className="text-xl font-bold text-zinc-900 mb-8">카테고리 관리</h1>
            <CategoryManager initialCategories={categories}/>
        </div>
    );
}
