import {prisma} from '@/lib/db';
import {Post} from '@/types';

export interface PostCreateInput {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

export interface PostUpdateInput {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
}

function mapPost(p: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}): Post {
    return {
        id: p.id,
        title: p.title,
        content: p.content,
        category: p.category,
        tags: p.tags,
        image: p.image ?? null,
        date: p.date,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
    };
}

export const postRepository = {
    async findAll(): Promise<Post[]> {
        const rows = await prisma.post.findMany({orderBy: {createdAt: 'desc'}});
        return rows.map(mapPost);
    },

    async findById(id: string): Promise<Post | null> {
        const row = await prisma.post.findUnique({where: {id}});
        return row ? mapPost(row) : null;
    },

    async create(data: PostCreateInput): Promise<Post> {
        const row = await prisma.post.create({data});
        return mapPost(row);
    },

    async update(id: string, data: PostUpdateInput): Promise<Post> {
        const row = await prisma.post.update({where: {id}, data});
        return mapPost(row);
    },

    async delete(id: string): Promise<void> {
        await prisma.post.delete({where: {id}});
    },
};
