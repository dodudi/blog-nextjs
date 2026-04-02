import {Draft} from '@/types';
import {draftRepository} from '@/lib/repositories/draftRepository';

export type {DraftInput} from '@/lib/repositories/draftRepository';
import type {DraftInput} from '@/lib/repositories/draftRepository';

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
