export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {method: 'POST', body: formData});
    const body = await res.json();

    if (!res.ok) {
        throw new Error(body.error?.message ?? '이미지 업로드에 실패했습니다.');
    }

    return body.data.url as string;
}
