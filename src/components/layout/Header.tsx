import Link from 'next/link';
import { auth } from '@/auth';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function Header() {
    const session = await auth();
    const isAdmin = session?.user?.role === 'admin';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
            <div className="mx-auto flex h-14 max-w-[1000px] items-center justify-between px-4">
                <Link
                    href="/"
                    className="text-base font-semibold tracking-tight text-zinc-900"
                >
                    RudyNote
                </Link>
                <nav className="flex items-center gap-4">
                    {isAdmin ? (
                        <>
                            <Link
                                href="/settings/categories"
                                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                            >
                                카테고리
                            </Link>
                            <Link
                                href="/write"
                                className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                            >
                                새 글
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                        >
                            로그인
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
