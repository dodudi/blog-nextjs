'use client';

import {deletePost} from '@/lib/actions/posts';
import Button from '@/components/ui/Button';

export default function DeleteButton({id}: { id: string }) {
    async function handleDelete() {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        await deletePost(id);
    }

    return (
        <Button variant="danger" onClick={handleDelete} aria-label="글 삭제">
            삭제
        </Button>
    );
}
