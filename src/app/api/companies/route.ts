import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-expect-error we attach id in session in our auth flow
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const companies = await prisma.company.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, createdAt: true },
  });

  return NextResponse.json({ companies });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // @ts-expect-error we attach id in session in our auth flow
  const userId = session?.user?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = body?.name?.trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name too short" }, { status: 400 });
  }

  try {
    const company = await prisma.company.create({
      data: { userId, name },
      select: { id: true, name: true, createdAt: true },
    });
    return NextResponse.json({ company }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Company already exists (for this user)" },
      { status: 409 }
    );
  }
}

