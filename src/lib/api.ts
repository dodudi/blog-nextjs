import {NextResponse} from 'next/server';
import {NotFoundError, ConflictError, ValidationError} from '@/lib/errors';

export function apiSuccess<T>(data: T, status = 200): NextResponse {
    return NextResponse.json({data}, {status});
}

export function apiError(status: number, code: string, message: string): NextResponse {
    return NextResponse.json({error: {code, message}}, {status});
}

export function handleError(error: unknown): NextResponse {
    if (error instanceof NotFoundError) {
        return apiError(404, 'NOT_FOUND', error.message);
    }
    if (error instanceof ConflictError) {
        return apiError(409, 'CONFLICT', error.message);
    }
    if (error instanceof ValidationError) {
        return apiError(400, 'VALIDATION_ERROR', error.message);
    }
    return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred');
}
