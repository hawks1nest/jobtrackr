import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // @ts-expect-error we attach id in session
  const userId = session.user.id as string | undefined;
  const email = session.user.email;

  const [companiesCount, applicationsCount] = userId
    ? await Promise.all([
        prisma.company.count({ where: { userId } }),
        prisma.application.count({ where: { userId } }),
      ])
    : [0, 0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Welcome, {email}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Companies</div>
          <div className="mt-1 text-3xl font-semibold">{companiesCount}</div>
          <a className="mt-3 inline-block underline" href="/companies">
            Manage companies →
          </a>
        </div>

        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Applications</div>
          <div className="mt-1 text-3xl font-semibold">{applicationsCount}</div>
          <a className="mt-3 inline-block underline" href="/applications">
            View applications →
          </a>
        </div>
      </div>
    </div>
  );
}