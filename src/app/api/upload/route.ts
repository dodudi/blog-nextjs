import {NextRequest} from 'next/server';
import {writeFile, mkdir} from 'fs/promises';
import {join} from 'path';
import {apiSuccess, apiError, handleError} from '@/lib/api';
import {ValidationError} from '@/lib/errors';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
};
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function detectMime(buf: Uint8Array): string | null {
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
    if (buf.length > 11 &&
        buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
        buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
    return null;
}

function getUploadDir(): string {
    return process.env.UPLOAD_DIR ?? join(process.cwd(), 'public', 'uploads');
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            throw new ValidationError('file field is required');
        }

        if (!ALLOWED_MIMES.has(file.type)) {
            throw new ValidationError('Only JPEG, PNG, GIF, WebP images are allowed');
        }

        if (file.size > MAX_BYTES) {
            return apiError(413, 'FILE_TOO_LARGE', 'File size must be 5 MB or less');
        }

        const buffer = new Uint8Array(await file.arrayBuffer());
        const detectedMime = detectMime(buffer);

        if (detectedMime !== file.type) {
            throw new ValidationError('File content does not match declared MIME type');
        }

        const ext = MIME_TO_EXT[file.type];
        const filename = `${crypto.randomUUID()}${ext}`;
        const dir = getUploadDir();

        await mkdir(dir, {recursive: true});
        await writeFile(join(dir, filename), buffer);

        return apiSuccess({url: `/uploads/${filename}`}, 201);
    } catch (e) {
        return handleError(e);
    }
}
