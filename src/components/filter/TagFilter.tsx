import TagBadge from '@/components/ui/TagBadge';

interface Props {
    tags: string[];
    selected: string;
    onSelect: (tag: string) => void;
}

export default function TagFilter({tags, selected, onSelect}: Props) {
    if (tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="태그 필터">
            {tags.map((tag) => (
                <TagBadge
                    key={tag}
                    tag={tag}
                    active={selected === tag}
                    onClick={() => onSelect(selected === tag ? '' : tag)}
                />
            ))}
        </div>
    );
}
