import {Draft} from '@/types';
import {draftRepository} from '@/lib/repositories/draftRepository';

export interface DraftInput {
    title: string;
    content: string;
    category: string;
    tags: string[];
    image: string | null;
}

export const draftService = {
    async get(): Promise<Draft | null> {
        return draftRepository.find();
    },

    async save(data: DraftInput): Promise<Draft> {
        return draftRepository.save(data);
    },

    async remove(): Promise<void> {
        return draftRepository.remove();
    },
};
