import {NextRequest, NextResponse} from 'next/server';
import {revalidatePath} from 'next/cache';
import {categoryService} from '@/lib/services/categoryService';
import {handleError} from '@/lib/api';

export async function DELETE(
    _request: NextRequest,
    {params}: {params: Promise<{id: string}>},
) {
    try {
        const {id} = await params;
        await categoryService.delete(id);
        revalidatePath('/');
        revalidatePath('/settings/categories');
        return new NextResponse(null, {status: 204});
    } catch (e) {
        return handleError(e);
    }
}
