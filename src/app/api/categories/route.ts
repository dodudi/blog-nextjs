import {NextRequest} from 'next/server';
import {revalidatePath} from 'next/cache';
import {categoryService} from '@/lib/services/categoryService';
import {ValidationError} from '@/lib/errors';
import {apiSuccess, handleError} from '@/lib/api';

export async function GET() {
    try {
        const categories = await categoryService.getAll();
        return apiSuccess(categories);
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {name} = body;

        if (!name) {
            throw new ValidationError('name is required');
        }

        const category = await categoryService.create(name);
        revalidatePath('/');
        revalidatePath('/settings/categories');
        revalidatePath('/write');
        return apiSuccess(category, 201);
    } catch (e) {
        return handleError(e);
    }
}
