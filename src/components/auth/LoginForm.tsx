"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";

interface Props {
    callbackUrl?: string;
}

export default function LoginForm({ callbackUrl }: Props) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
            router.push(callbackUrl ?? "/");
        }
    }

    return (
        <div className="w-full max-w-[400px] rounded-xl border border-zinc-200 bg-white p-8">
            <h1 className="mb-6 text-lg font-semibold text-zinc-900">로그인</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="username" className="text-sm font-medium text-zinc-700">
                        아이디
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        autoComplete="username"
                        className="border border-zinc-200 rounded-md px-3 py-2 w-full text-sm outline-none focus:border-zinc-400"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-zinc-700">
                        비밀번호
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        className="border border-zinc-200 rounded-md px-3 py-2 w-full text-sm outline-none focus:border-zinc-400"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" disabled={loading} className="mt-2 w-full justify-center">
                    {loading ? "로그인 중..." : "로그인"}
                </Button>
            </form>
        </div>
    );
}
