import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    
    const events = await prisma.lifeEvent.findMany({
      where: { userId: user.id },
      orderBy: { occurredAt: 'desc' }
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const lifeEventSchema = z.object({
  label: z.string().min(1),
  category: z.string().min(1),
  occurredAt: z.string().datetime(), // Expect ISO string
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json();
    
    const result = lifeEventSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const event = await prisma.lifeEvent.create({
      data: {
        userId: user.id,
        label: result.data.label,
        category: result.data.category,
        occurredAt: new Date(result.data.occurredAt),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
