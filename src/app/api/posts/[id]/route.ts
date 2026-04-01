import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {postService} from '@/lib/services/postService';
import {apiSuccess, handleError} from '@/lib/api';

export async function GET(
    _request: NextRequest,
    {params}: {params: Promise<{id: string}>},
) {
    try {
        const {id} = await params;
        const post = await postService.getById(id);
        return apiSuccess(post);
    } catch (e) {
        return handleError(e);
    }
}

export async function PUT(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>},
) {
    try {
        const {id} = await params;
        const body = await request.json();
        const {title, content, category = '', tags = [], image = null, date} = body;

        const post = await postService.update(id, {title, content, category, tags, image, date});
        revalidatePath('/');
        revalidatePath('/post/[id]', 'page');
        return apiSuccess(post);
    } catch (e) {
        return handleError(e);
    }
}

export async function DELETE(
    _request: NextRequest,
    {params}: {params: Promise<{id: string}>},
) {
    try {
        const {id} = await params;
        await postService.delete(id);
        revalidatePath('/');
        return new NextResponse(null, {status: 204});
    } catch (e) {
        return handleError(e);
    }
}
