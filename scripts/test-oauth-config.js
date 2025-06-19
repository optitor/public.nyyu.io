// scripts/test-oauth-config.js
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

console.log("🔍 OAuth Configuration Test\n");

// Required environment variables
const requiredVars = [
    "GATSBY_SITE_URL",
    "GATSBY_API_BASE_URL",
    "GATSBY_GOOGLE_CLIENT_ID",
    "GATSBY_LINKEDIN_CLIENT_ID",
    "GATSBY_AMAZON_CLIENT_ID",
];

// Optional environment variables
const optionalVars = [
    "GATSBY_JWT_SECRET",
    "GATSBY_BINANCE_API_KEY",
    "GATSBY_INFURA_ID",
    "GATSBY_MOBILE_DEEP_LINK_SCHEME",
    "GATSBY_MOBILE_REDIRECT_URI",
    "GATSBY_GA_TRACKING_ID",
    "GATSBY_GTM_ID",
];

let hasErrors = false;
let hasWarnings = false;

console.log("📋 Checking Required Variables:");
console.log("================================");

requiredVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${maskValue(value)}`);
    } else {
        console.log(`❌ ${varName}: NOT SET`);
        hasErrors = true;
    }
});

console.log("\n📋 Checking Optional Variables:");
console.log("================================");

optionalVars.forEach((varName) => {
    const value = process.env[varName];
    if (value) {
        console.log(`✅ ${varName}: ${maskValue(value)}`);
    } else {
        console.log(`⚠️  ${varName}: NOT SET (optional)`);
        hasWarnings = true;
    }
});

// Validate URL formats
console.log("\n🔗 Validating URLs:");
console.log("===================");

const siteUrl = process.env.GATSBY_SITE_URL;
const apiUrl = process.env.GATSBY_API_BASE_URL;

if (siteUrl) {
    try {
        new URL(siteUrl);
        console.log(`✅ GATSBY_SITE_URL format is valid`);

        // Test OAuth redirect URI
        const oauthRedirectUri = `${siteUrl}/oauth2/redirect`;
        console.log(`📍 OAuth Redirect URI: ${oauthRedirectUri}`);
    } catch (error) {
        console.log(`❌ GATSBY_SITE_URL format is invalid: ${error.message}`);
        hasErrors = true;
    }
}

if (apiUrl) {
    try {
        new URL(apiUrl);
        console.log(`✅ GATSBY_API_BASE_URL format is valid`);
    } catch (error) {
        console.log(
            `❌ GATSBY_API_BASE_URL format is invalid: ${error.message}`,
        );
        hasErrors = true;
    }
}

// Check OAuth provider configuration
console.log("\n🔐 OAuth Provider Configuration:");
console.log("=================================");

const providers = [
    { name: "Google", clientId: process.env.GATSBY_GOOGLE_CLIENT_ID },
    { name: "LinkedIn", clientId: process.env.GATSBY_LINKEDIN_CLIENT_ID },
    { name: "Amazon", clientId: process.env.GATSBY_AMAZON_CLIENT_ID },
];

providers.forEach((provider) => {
    if (provider.clientId) {
        console.log(`✅ ${provider.name}: Configured`);
    } else {
        console.log(`❌ ${provider.name}: Not configured`);
        hasErrors = true;
    }
});

// Test mobile OAuth configuration
console.log("\n📱 Mobile OAuth Configuration:");
console.log("==============================");

const mobileScheme = process.env.GATSBY_MOBILE_DEEP_LINK_SCHEME;
const mobileRedirectUri = process.env.GATSBY_MOBILE_REDIRECT_URI;

if (mobileScheme) {
    console.log(`✅ Mobile Deep Link Scheme: ${mobileScheme}://`);
} else {
    console.log(`⚠️  Mobile Deep Link Scheme: Using default (nyyu://)`);
}

if (mobileRedirectUri) {
    console.log(`✅ Mobile Redirect URI: ${mobileRedirectUri}`);
} else {
    console.log(
        `⚠️  Mobile Redirect URI: Using default (nyyu://oauth/callback)`,
    );
}

// Check for .env files
console.log("\n📄 Environment Files:");
console.log("=====================");

const envFiles = [".env.development", ".env.production", ".env.local", ".env"];
const existingEnvFiles = envFiles.filter((file) =>
    fs.existsSync(path.join(process.cwd(), file)),
);

if (existingEnvFiles.length > 0) {
    console.log(`✅ Found environment files: ${existingEnvFiles.join(", ")}`);
} else {
    console.log(
        `⚠️  No environment files found. Consider creating .env.development`,
    );
    hasWarnings = true;
}

// Generate sample OAuth URLs
if (siteUrl && apiUrl) {
    console.log("\n🔗 Sample OAuth URLs:");
    console.log("=====================");

    const redirectUri = `${siteUrl}/oauth2/redirect`;

    providers.forEach((provider) => {
        if (provider.clientId) {
            const providerName = provider.name.toLowerCase();
            const oauthUrl = `${apiUrl}/oauth2/authorize/${providerName}?redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email&state=test123`;
            console.log(`🔗 ${provider.name}: ${oauthUrl}`);
        }
    });
}

// Summary
console.log("\n📊 Configuration Summary:");
console.log("=========================");

if (hasErrors) {
    console.log("❌ Configuration has ERRORS that must be fixed");
    console.log("   Please set all required environment variables");
} else {
    console.log("✅ All required configuration is present");
}

if (hasWarnings) {
    console.log("⚠️  Configuration has WARNINGS (optional improvements)");
} else {
    console.log("✅ No warnings - configuration is complete");
}

// Recommendations
console.log("\n💡 Recommendations:");
console.log("===================");

if (!process.env.GATSBY_JWT_SECRET) {
    console.log("• Set GATSBY_JWT_SECRET for enhanced security");
}

if (!process.env.GATSBY_GA_TRACKING_ID) {
    console.log("• Set GATSBY_GA_TRACKING_ID for analytics tracking");
}

if (!process.env.GATSBY_MOBILE_DEEP_LINK_SCHEME) {
    console.log(
        "• Set GATSBY_MOBILE_DEEP_LINK_SCHEME for mobile app integration",
    );
}

console.log("• Ensure OAuth client IDs match your provider configurations");
console.log(
    "• Test OAuth flows in both development and production environments",
);
console.log("• Consider setting up HTTPS for production OAuth callbacks");
console.log(
    "• Review BINANCE_API_KEY usage - consider migrating to freeCryptoPrices system",
);

// Exit with appropriate code
process.exit(hasErrors ? 1 : 0);

// Helper function to mask sensitive values
function maskValue(value) {
    if (!value) return "NOT SET";

    // Don't mask URLs
    if (value.startsWith("http://") || value.startsWith("https://")) {
        return value;
    }

    // Don't mask scheme names
    if (value.length < 20 && !value.includes(".")) {
        return value;
    }

    // Mask client IDs and secrets
    if (value.length > 10) {
        return (
            value.substring(0, 4) + "..." + value.substring(value.length - 4)
        );
    }

    return value;
}
