"use client";

import { useEffect, useState } from "react";

type Company = { id: string; name: string; createdAt: string };
type Application = {
  id: string;
  roleTitle: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  createdAt: string;
  company: { id: string; name: string };
};

const STATUSES: Application["status"][] = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export default function ApplicationsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [companyId, setCompanyId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [status, setStatus] = useState<Application["status"]>("APPLIED");
  const [msg, setMsg] = useState<string | null>(null);

  async function loadAll() {
    setMsg(null);

    const cRes = await fetch("/api/companies");
    if (!cRes.ok) {
      setMsg("Not logged in. Go to /login");
      return;
    }
    const cData = await cRes.json();
    const cs: Company[] = cData.companies ?? [];
    setCompanies(cs);
    setCompanyId((prev) => prev || cs[0]?.id || "");

    const aRes = await fetch("/api/applications");
    if (!aRes.ok) {
      const j = await aRes.json().catch(() => ({}));
      setMsg(j.error ?? "Could not load applications");
      return;
    }
    const aData = await aRes.json();
    setApplications(aData.applications ?? []);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addApplication(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!companyId || !roleTitle.trim()) {
    setMsg("Write a role title and select a company.");
    return;
}
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyId, roleTitle, status }),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setMsg(j.error ?? "Failed");
      return;
    }

    setRoleTitle("");
    await loadAll();
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold">Applications</h1>
      {companies.length === 0 && (
  <p className="mt-4 text-sm text-red-600">
    No companies yet. Add one first at{" "}
    <a className="underline" href="/companies">/companies</a>.
  </p>
)}
      <form onSubmit={addApplication} className="mt-6 grid gap-2">
        <select
          className="rounded border p-2"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          className="rounded border p-2"
          placeholder="Role title (e.g. Backend Engineer)"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
        />

        <select
          className="rounded border p-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as Application["status"])}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button className="rounded bg-black p-2 text-white">Add application</button>
      </form>

      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}

      <ul className="mt-6 space-y-2">
        {applications.map((a) => (
          <li key={a.id} className="rounded border p-3">
            <div className="font-medium">{a.roleTitle}</div>
            <div className="text-sm">{a.company.name}</div>
            <div className="text-xs text-gray-500">
              {a.status} • {new Date(a.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}