import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const testEmail = "test@biopage.store";
    const testPassword = "password123";

    console.log("Checking DB connection...");
    const user = await prisma.user.findUnique({ where: { email: testEmail } });

    if (!user) {
        console.log("USER NOT FOUND in database!");
        console.log("Creating user now...");
        const hashed = await bcrypt.hash(testPassword, 10);
        const created = await prisma.user.create({
            data: {
                email: testEmail,
                password: hashed,
                username: "testuser_biopage",
                name: "Test User",
                onboardingDone: true,
            }
        });
        console.log("Created:", created.email, "username:", created.username);
    } else {
        console.log("User found:", user.email);
        console.log("Username:", user.username);
        console.log("Has password:", !!user.password);
        console.log("OnboardingDone:", user.onboardingDone);
        if (user.password) {
            const valid = await bcrypt.compare(testPassword, user.password);
            console.log("Password 'password123' valid:", valid);
            if (!valid) {
                console.log("Resetting password to 'password123'...");
                const hashed = await bcrypt.hash(testPassword, 10);
                await prisma.user.update({ where: { email: testEmail }, data: { password: hashed } });
                console.log("Password reset done.");
            }
        }
    }
}

main()
    .catch((e) => { console.error("ERROR:", e.message); process.exit(1); })
    .finally(() => { prisma.$disconnect(); });
