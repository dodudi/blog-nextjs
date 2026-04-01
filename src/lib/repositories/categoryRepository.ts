import {prisma} from '@/lib/db';
import {Category} from '@/types';

function mapCategory(c: {
    id: string;
    name: string;
    createdAt: Date;
}): Category {
    return {
        id: c.id,
        name: c.name,
        createdAt: c.createdAt.toISOString(),
    };
}

export const categoryRepository = {
    async findAll(): Promise<Category[]> {
        const rows = await prisma.category.findMany({orderBy: {createdAt: 'asc'}});
        return rows.map(mapCategory);
    },

    async findById(id: string): Promise<Category | null> {
        const row = await prisma.category.findUnique({where: {id}});
        return row ? mapCategory(row) : null;
    },

    async findByName(name: string): Promise<Category | null> {
        const row = await prisma.category.findUnique({where: {name}});
        return row ? mapCategory(row) : null;
    },

    async create(name: string): Promise<Category> {
        const row = await prisma.category.create({data: {name}});
        return mapCategory(row);
    },

    async delete(id: string): Promise<void> {
        await prisma.category.delete({where: {id}});
    },

    async clearPostCategory(categoryName: string): Promise<void> {
        await prisma.post.updateMany({
            where: {category: categoryName},
            data: {category: ''},
        });
    },
};
