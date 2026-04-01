import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {draftService} from '@/lib/services/draftService';
import {apiSuccess, handleError} from '@/lib/api';

export async function GET() {
    try {
        const draft = await draftService.get();
        return apiSuccess(draft);
    } catch (e) {
        return handleError(e);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const {title = '', content = '', category = '', tags = [], image = null} = body;

        const draft = await draftService.save({title, content, category, tags, image});
        revalidatePath('/');
        return apiSuccess(draft);
    } catch (e) {
        return handleError(e);
    }
}

export async function DELETE() {
    try {
        await draftService.remove();
        revalidatePath('/');
        return new NextResponse(null, {status: 204});
    } catch (e) {
        return handleError(e);
    }
}
