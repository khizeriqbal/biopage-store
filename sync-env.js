const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const envPath = path.join('d:', 'bio page final', 'biopage-store', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const lines = envContent.split('\n');
const envVars = {};

lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const firstEq = trimmed.indexOf('=');
    if (firstEq === -1) return;

    const key = trimmed.substring(0, firstEq).trim();
    let value = trimmed.substring(firstEq + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
    }

    envVars[key] = value;
});

// Production URL - Adjust as needed
const prodUrl = 'https://biopage-store.vercel.app';

// Override specific variables for production
if (envVars['NEXTAUTH_URL']) envVars['NEXTAUTH_URL'] = prodUrl;
if (envVars['NEXT_PUBLIC_APP_URL']) envVars['NEXT_PUBLIC_APP_URL'] = prodUrl;

console.log('--- Syncing Environment Variables to Vercel (Production) ---');

const skipKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']; // Empty in your .env

for (const [key, value] of Object.entries(envVars)) {
    if (skipKeys.includes(key)) continue;
    if (!value) continue;

    console.log(`Setting ${key}...`);
    try {
        // Try to add. If it exists, it might fail, so we might need to remove it first.
        // Vercel CLI doesn't have an easy "upsert".
        // We'll run 'vercel env rm' first just in case.
        try {
            execSync(`vercel env rm ${key} production --yes`, { stdio: 'ignore' });
        } catch (e) {
            // Probably didn't exist
        }

        // Add it. Use --value and --yes. Wrap value in quotes for the shell.
        // We'll use a temporary file for the value to avoid shell escaping issues if needed,
        // but let's try direct first.
        execSync(`vercel env add ${key} production --value "${value.replace(/"/g, '\\"')}" --yes`);
        console.log(`✅ ${key} added.`);
    } catch (error) {
        console.error(`❌ Failed to set ${key}: ${error.message}`);
    }
}

console.log('--- Sync Complete ---');
console.log('Next step: run `vercel --prod` to deploy.');
