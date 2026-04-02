import type {MetadataRoute} from 'next';
import {config} from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
    const siteUrl = config.site.url;

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/write', '/settings/'],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
