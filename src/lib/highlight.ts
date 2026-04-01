export function getHighlightParts(
    text: string,
    query: string
): { text: string; match: boolean }[] {
    if (!query.trim()) return [{text, match: false}];
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    const q = query.toLowerCase();
    return parts.filter(Boolean).map((part) => ({
        text: part,
        match: part.toLowerCase() === q,
    }));
}
