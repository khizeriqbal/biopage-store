import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username");

    if (!username || username.length < 3) {
      return NextResponse.json(
        { available: false, error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    const available = !existingUser;

    return NextResponse.json({ available });
  } catch (error) {
    console.error("[CHECK_USERNAME_ERROR]", error);
    // Return true (available) on error to allow user to proceed
    return NextResponse.json({ available: true });
  }
}
