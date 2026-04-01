interface Props {
    value: string;
    onChange: (value: string) => void;
    resultCount?: number;
}

export default function SearchBar({value, onChange, resultCount}: Props) {
    return (
        <div className="space-y-1.5">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="제목, 내용, 태그 검색..."
                className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none placeholder-zinc-400 focus:border-zinc-400 transition-colors"
                aria-label="검색"
            />
            {value.trim() && (
                <p className="text-xs text-zinc-400">검색 결과 {resultCount}건</p>
            )}
        </div>
    );
}
