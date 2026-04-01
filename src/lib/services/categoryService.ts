import {Category} from '@/types';
import {categoryRepository} from '@/lib/repositories/categoryRepository';
import {NotFoundError, ConflictError, ValidationError} from '@/lib/errors';

export const categoryService = {
    async getAll(): Promise<Category[]> {
        return categoryRepository.findAll();
    },

    async create(name: string): Promise<Category> {
        const trimmed = name.trim();
        if (!trimmed) throw new ValidationError('Category name cannot be empty');

        const existing = await categoryRepository.findByName(trimmed);
        if (existing) throw new ConflictError(`Category already exists: ${trimmed}`);

        return categoryRepository.create(trimmed);
    },

    async delete(id: string): Promise<void> {
        const category = await categoryRepository.findById(id);
        if (!category) throw new NotFoundError(`Category not found: ${id}`);

        await categoryRepository.clearPostCategory(category.name);
        await categoryRepository.delete(id);
    },
};
