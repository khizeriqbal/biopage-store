import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "test@biopage.store";
    const password = "Test1234!";
    const username = "testcreator";
    const name = "Test Creator";

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("✅ Test user already exists:");
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   Username: ${username}`);
        return;
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            email,
            password: hashed,
            username,
            name,
            bio: "I create digital products and courses for ambitious creators.",
            niche: "Creator Economy",
            onboardingDone: true,
            plan: "PRO",
        },
    });

    console.log("✅ Test user created successfully!");
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Username: ${username}`);
    console.log(`   Plan:     PRO`);
    console.log("");
    console.log("👉 Go to http://localhost:3000/login to sign in");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
