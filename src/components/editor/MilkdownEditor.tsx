'use client';

import {useEffect, useRef} from 'react';
import {Crepe, CrepeFeature} from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';

interface Props {
    defaultValue?: string;
    onChange?: (markdown: string) => void;
}

export default function MilkdownEditor({defaultValue = '', onChange}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const crepe = new Crepe({
            root: container,
            defaultValue,
            features: {
                [CrepeFeature.Toolbar]: false,
                [CrepeFeature.TopBar]: false,
                [CrepeFeature.Latex]: false,
            },
        });

        crepe
            .on((api) => {
                api.markdownUpdated((_, markdown) => {
                    onChangeRef.current?.(markdown);
                });
            })
            .create();

        return () => {
            crepe.destroy();
            container.innerHTML = '';
        };
    }, []);

    return <div ref={containerRef} className="milkdown-wrap"/>;
}
