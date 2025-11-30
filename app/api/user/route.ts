import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json();
    
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const updatedUser = await prisma.userProfile.update({
      where: { id: user.id },
      data: result.data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
