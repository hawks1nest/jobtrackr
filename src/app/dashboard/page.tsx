import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <p className="mt-2 text-sm text-gray-600">
        If you can see this, you are logged in.
      </p>

      <pre className="mt-4 rounded bg-gray-100 p-3 text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}