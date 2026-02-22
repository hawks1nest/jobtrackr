import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.toLowerCase().trim();
  const password = body?.password;

  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash } });

  return NextResponse.json({ ok: true }, { status: 201 });
}