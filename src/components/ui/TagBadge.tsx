interface Props {
    tag: string;
    onClick?: () => void;
    active?: boolean;
}

export default function TagBadge({tag, onClick, active}: Props) {
    return (
        <span
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                onClick ? 'cursor-pointer' : ''
            } ${
                active
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
        >
      #{tag}
    </span>
    );
}
