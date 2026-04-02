"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
        >
            로그아웃
        </button>
    );
}
