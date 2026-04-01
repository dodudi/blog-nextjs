export function readingTime(content: string): number {
    const text = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/[#*_>|~\-=]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return Math.max(1, Math.ceil(text.length / 500));
}

export function summarize(content: string): string {
    return content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '$1')
        .replace(/[#*_>|~]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
