'use client';

import {useEffect, useRef} from 'react';
import {Crepe, CrepeFeature} from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import {uploadImage} from '@/lib/uploadImage';

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
            featureConfigs: {
                [CrepeFeature.ImageBlock]: {
                    onUpload: uploadImage,
                    inlineOnUpload: uploadImage,
                    blockOnUpload: uploadImage,
                },
            },
        });

        crepe
            .on((api) => {
                api.markdownUpdated((_, markdown) => {
                    onChangeRef.current?.(markdown);
                });
            })
            .create()
            .catch(() => {
                // destroy()가 create() 완료 전에 호출되면(React StrictMode) 에러 무시
            });

        return () => {
            crepe.destroy();
            container.innerHTML = '';
        };
    }, []);

    return <div ref={containerRef} className="milkdown-wrap"/>;
}
