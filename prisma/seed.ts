import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "test@biopage.store";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = "testuser" + Math.floor(Math.random() * 1000);

    console.log("Creating test user...");
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            email,
            password: hashedPassword,
            username,
            name: "Test User",
            onboardingDone: true,
        },
    });

    console.log("User created/updated:", user.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
