"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error || "Signup failed");
      return;
    }

    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold">Create account</h1>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="password (min 8)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {msg && <p className="text-sm text-red-600">{msg}</p>}

        <button className="w-full rounded bg-black p-2 text-white">
          Sign up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Have an account? <a className="underline" href="/login">Login</a>
      </p>
    </div>
  );
}