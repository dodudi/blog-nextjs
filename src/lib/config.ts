function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`[config] 필수 환경변수 누락: ${key}`);
    return value;
}

export const config = {
    site: {
        url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    },
    admin: {
        get username() { return requireEnv('ADMIN_USERNAME'); },
        get passwordHash() { return Buffer.from(requireEnv('ADMIN_PASSWORD_HASH_B64'), 'base64').toString(); },
    },
    minio: {
        get endpoint()    { return requireEnv('MINIO_ENDPOINT'); },
        get publicUrl()   { return requireEnv('MINIO_PUBLIC_URL'); },
        get accessKeyId() { return requireEnv('MINIO_ACCESS_KEY_ID'); },
        get secretKey()   { return requireEnv('MINIO_SECRET_ACCESS_KEY'); },
        bucket: process.env.MINIO_BUCKET ?? 'blog',
    },
};
