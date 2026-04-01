import {Post} from '@/types';
import PostCard from './PostCard';

interface Props {
    posts: Post[];
    query?: string;
}

export default function PostList({posts, query}: Props) {
    if (posts.length === 0) {
        return (
            <p className="text-center text-zinc-400 py-20 text-sm">
                {query ? '검색 결과가 없습니다.' : '아직 작성된 글이 없습니다.'}
            </p>
        );
    }

    return (
        <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <PostCard post={post} query={query}/>
                </li>
            ))}
        </ul>
    );
}
