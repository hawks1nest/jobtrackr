"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Company = { id: string; name: string; createdAt: string };

export default function CompaniesPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const res = await fetch("/api/companies");

    if (res.status === 401) {
      router.replace("/login");
      return;
    }

    if (!res.ok) {
      setMsg("Something went wrong.");
      return;
    }

    const data = await res.json();
    setCompanies(data.companies ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addCompany(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.status === 401) {
      router.replace("/login");
      return;
    }

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "Failed");
      return;
    }

    setName("");
    await load();
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Companies</h1>

      <form onSubmit={addCompany} className="mt-6 flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          placeholder="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="rounded bg-black px-4 text-white">Add</button>
      </form>

      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

      <ul className="mt-6 space-y-2">
        {companies.map((c) => (
          <li key={c.id} className="rounded border p-3">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}