import {Category} from '@/types';

interface Props {
    categories: Category[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function CategoryFilter({categories, selected, onSelect}: Props) {
    if (categories.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2" role="group" aria-label="카테고리 필터">
            {['', ...categories.map((c) => c.name)].map((name) => (
                <button
                    key={name || '__all__'}
                    onClick={() => onSelect(name)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        selected === name
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                    aria-pressed={selected === name}
                >
                    {name || '전체'}
                </button>
            ))}
        </div>
    );
}
