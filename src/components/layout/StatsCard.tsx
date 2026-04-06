interface Props {
    postCount: number;
    categoryCount: number;
    tagCount: number;
}

interface StatItemProps {
    label: string;
    value: number;
}

function StatItem({label, value}: StatItemProps) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-base font-semibold text-zinc-900">{value.toLocaleString()}</span>
            <span className="text-xs text-zinc-400">{label}</span>
        </div>
    );
}

export default function StatsCard({postCount, categoryCount, tagCount}: Props) {
    return (
        <div className="rounded-xl border border-zinc-100 px-5 py-4 grid grid-cols-3 gap-4">
            <StatItem label="게시글" value={postCount}/>
            <StatItem label="카테고리" value={categoryCount}/>
            <StatItem label="태그" value={tagCount}/>
        </div>
    );
}
