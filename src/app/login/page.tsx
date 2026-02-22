"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setMsg("Login failed");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Login</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <button className="w-full rounded bg-black p-2 text-white">
          Sign in
        </button>
      </form>

      <p className="mt-4 text-sm">
        No account? <a className="underline" href="/signup">Create one</a>
      </p>
    </div>
  );
}