'use client';

import {useMemo, useState} from 'react';
import {Category, Post} from '@/types';
import SearchBar from '@/components/filter/SearchBar';
import CategoryFilter from '@/components/filter/CategoryFilter';
import TagFilter from '@/components/filter/TagFilter';
import PostList from '@/components/post/PostList';

interface Props {
    posts: Post[];
    categories: Category[];
    allTags: string[];
}

export default function PostFeed({posts, categories, allTags}: Props) {
    const [query, setQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTag, setSelectedTag] = useState('');

    const filtered = useMemo(() => {
        let result = posts;

        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        if (selectedTag) {
            result = result.filter((p) => p.tags.includes(selectedTag));
        }

        if (query.trim()) {
            const q = query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.content.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        return result;
    }, [posts, query, selectedCategory, selectedTag]);

    return (
        <div className="space-y-5">
            <SearchBar
                value={query}
                onChange={setQuery}
                resultCount={filtered.length}
            />
            <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />
            <TagFilter
                tags={allTags}
                selected={selectedTag}
                onSelect={setSelectedTag}
            />
            <PostList posts={filtered} query={query.trim() ? query : undefined}/>
        </div>
    );
}
