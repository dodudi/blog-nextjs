import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {postService} from '@/lib/services/postService';
import {ValidationError} from '@/lib/errors';
import {apiSuccess, handleError} from '@/lib/api';

export async function GET() {
    try {
        const posts = await postService.getAll();
        return apiSuccess(posts);
    } catch (e) {
        return handleError(e);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {title, content, category = '', tags = [], image = null, date} = body;

        if (!title || !content) {
            throw new ValidationError('title and content are required');
        }

        const post = await postService.create({title, content, category, tags, image, date});
        revalidatePath('/');
        return apiSuccess(post, 201);
    } catch (e) {
        return handleError(e);
    }
}
