import {Post} from '@/types';
import {postRepository} from '@/lib/repositories/postRepository';
import {NotFoundError} from '@/lib/errors';

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

export const postService = {
    async getAll(): Promise<Post[]> {
        return postRepository.findAll();
    },

    async getById(id: string): Promise<Post> {
        const post = await postRepository.findById(id);
        if (!post) throw new NotFoundError(`Post not found: ${id}`);
        return post;
    },

    async create(data: PostCreateInput): Promise<Post> {
        return postRepository.create(data);
    },

    async update(id: string, data: PostUpdateInput): Promise<Post> {
        const existing = await postRepository.findById(id);
        if (!existing) throw new NotFoundError(`Post not found: ${id}`);
        return postRepository.update(id, data);
    },

    async delete(id: string): Promise<void> {
        const existing = await postRepository.findById(id);
        if (!existing) throw new NotFoundError(`Post not found: ${id}`);
        return postRepository.delete(id);
    },
};
