require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

console.log("🔍 Manual OAuth Configuration Test\n");

// Test environment variables
console.log("📋 Environment Variables:");
console.log("=========================");
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("GATSBY_SITE_URL:", process.env.GATSBY_SITE_URL || "NOT SET");
console.log(
    "GATSBY_API_BASE_URL:",
    process.env.GATSBY_API_BASE_URL || "NOT SET",
);
console.log(
    "GATSBY_GOOGLE_CLIENT_ID:",
    process.env.GATSBY_GOOGLE_CLIENT_ID ? "SET" : "NOT SET",
);
console.log(
    "GATSBY_LINKEDIN_CLIENT_ID:",
    process.env.GATSBY_LINKEDIN_CLIENT_ID ? "SET" : "NOT SET",
);
console.log(
    "GATSBY_AMAZON_CLIENT_ID:",
    process.env.GATSBY_AMAZON_CLIENT_ID ? "SET" : "NOT SET",
);

// Test URL generation
console.log("\n🔗 Generated URLs:");
console.log("==================");
const siteUrl = process.env.GATSBY_SITE_URL || "http://localhost:4000";
const apiUrl = process.env.GATSBY_API_BASE_URL || "http://localhost:4000/api";
const redirectUri = `${siteUrl}/oauth2/redirect`;

console.log("OAuth Redirect URI:", redirectUri);
console.log(
    "Google OAuth URL:",
    `${apiUrl}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(redirectUri)}`,
);
console.log(
    "LinkedIn OAuth URL:",
    `${apiUrl}/oauth2/authorize/linkedin?redirect_uri=${encodeURIComponent(redirectUri)}`,
);
console.log(
    "Amazon OAuth URL:",
    `${apiUrl}/oauth2/authorize/amazon?redirect_uri=${encodeURIComponent(redirectUri)}`,
);

// Test mobile URLs
console.log("\n📱 Mobile OAuth URLs:");
console.log("=====================");
const mobileRedirectUri =
    process.env.GATSBY_MOBILE_REDIRECT_URI || "nyyu://oauth/callback";
console.log("Mobile Redirect URI:", mobileRedirectUri);
console.log(
    "Mobile Google URL:",
    `${apiUrl}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(mobileRedirectUri)}&mobile=true`,
);

console.log("\n✅ Test completed!");
