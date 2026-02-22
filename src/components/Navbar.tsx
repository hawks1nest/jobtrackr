"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`inline-block rounded px-3 py-2 text-sm ${
        active ? "bg-black text-white" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

export default function NavBar() {
  return (
    <header className="border-b bg-red-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-3">
        <Link href="/dashboard" className="font-semibold px-2">
          JobTrackr
        </Link>

        <nav className="flex items-center gap-4">
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/companies" label="Companies" />
          <NavLink href="/applications" label="Applications" />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded bg-black px-3 py-2 text-sm text-white"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}