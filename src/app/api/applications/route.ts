import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getUserId(session: any): string | undefined {
  return session?.user?.id;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const applications = await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      roleTitle: true,
      status: true,
      createdAt: true,
      company: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const companyId = body?.companyId as string | undefined;
  const roleTitle = body?.roleTitle?.trim() as string | undefined;
  const status = body?.status as "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | undefined;

  if (!companyId || !roleTitle) {
    return NextResponse.json({ error: "companyId and roleTitle are required" }, { status: 400 });
  }

  // προστασία: σιγουρευόμαστε ότι το company ανήκει στον χρήστη
  const company = await prisma.company.findFirst({ where: { id: companyId, userId } });
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const app = await prisma.application.create({
    data: { userId, companyId, roleTitle, status: status ?? "APPLIED" },
    select: {
      id: true,
      roleTitle: true,
      status: true,
      createdAt: true,
      company: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ application: app }, { status: 201 });
}