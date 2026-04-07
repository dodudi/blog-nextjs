import {NextRequest} from 'next/server';
import {S3Client, PutObjectCommand, CreateBucketCommand, PutBucketPolicyCommand, HeadBucketCommand} from '@aws-sdk/client-s3';
import {config} from '@/lib/config';
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

function makeClient() {
    return new S3Client({
        endpoint: config.minio.endpoint,
        region: 'us-east-1',
        credentials: {
            accessKeyId: config.minio.accessKeyId,
            secretAccessKey: config.minio.secretKey,
        },
        forcePathStyle: true,
    });
}

let bucketReady = false;

async function ensureBucket(client: S3Client) {
    if (bucketReady) return;

    const bucket = config.minio.bucket;

    try {
        await client.send(new HeadBucketCommand({Bucket: bucket}));
    } catch {
        await client.send(new CreateBucketCommand({Bucket: bucket}));
    }

    await client.send(new PutBucketPolicyCommand({
        Bucket: bucket,
        Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [{
                Effect: 'Allow',
                Principal: {AWS: ['*']},
                Action: ['s3:GetObject'],
                Resource: [`arn:aws:s3:::${bucket}/*`],
            }],
        }),
    }));

    bucketReady = true;
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

        const client = makeClient();
        await ensureBucket(client);

        await client.send(new PutObjectCommand({
            Bucket: config.minio.bucket,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        }));

        const url = `${config.minio.publicUrl}/${config.minio.bucket}/${filename}`;
        return apiSuccess({url}, 201);
    } catch (e) {
        return handleError(e);
    }
}
