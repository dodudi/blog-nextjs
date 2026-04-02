import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "로그인 | RudyNote",
};

interface Props {
    searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
    const session = await auth();
    if (session?.user) redirect("/");

    const { callbackUrl } = await searchParams;

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
            <LoginForm callbackUrl={callbackUrl} />
        </div>
    );
}
