import type {MetadataRoute} from 'next';
import {prisma} from '@/lib/db';
import {config} from '@/lib/config';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = config.site.url;

    const posts = await prisma.post.findMany({
        select: {id: true, updatedAt: true},
        orderBy: {createdAt: 'desc'},
    });

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${siteUrl}/post/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...postEntries,
    ];
}
