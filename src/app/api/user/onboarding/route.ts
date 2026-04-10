import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, bio, avatar, niche, accentColor } = await req.json();

    // Update user with onboarding data
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || session.user.name,
        bio,
        avatar,
        niche,
        onboardingDone: true,
      },
    });

    // Create page settings
    await prisma.pageSettings.upsert({
      where: { userId: session.user.id },
      update: { accentColor },
      create: {
        userId: session.user.id,
        accentColor,
      },
    });

    return NextResponse.json(
      {
        message: "Onboarding completed",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ONBOARDING_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
