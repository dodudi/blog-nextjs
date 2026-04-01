import {ButtonHTMLAttributes} from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({
                                   variant = 'primary',
                                   className = '',
                                   children,
                                   ...props
                               }: Props) {
    const variants = {
        primary: 'bg-zinc-900 text-white hover:bg-zinc-700',
        secondary: 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50',
        danger: 'text-red-600 hover:bg-red-50',
    };

    return (
        <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
