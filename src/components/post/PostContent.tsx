'use client';

import type {Components} from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
    content: string;
}

const components: Components = {
    code({className, children, ...props}) {
        const match = /language-(\w+)/.exec(className ?? '');
        const isInline = !match;

        if (isInline) {
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }

        return (
            <SyntaxHighlighter
                style={oneLight}
                language={match[1]}
                PreTag="div"
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        );
    },
};

export default function PostContent({content}: Props) {
    return (
        <div className="prose prose-zinc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
