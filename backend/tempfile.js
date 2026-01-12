require("dotenv").config();
const { google } = require("googleapis");
const readline = require("readline");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",   // 🔥 Must for refresh token
  scope: SCOPES,
});

console.log("\n🔗 Open this URL in browser:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste authorization code here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);

    console.log("\n✅ TOKENS RECEIVED:\n");
    console.log(tokens);

    if (tokens.refresh_token) {
      console.log("\n🔥 SAVE THIS REFRESH TOKEN:\n");
      console.log(tokens.refresh_token);
    } else {
      console.log("\n⚠️ No refresh token received. Revoke app and try again.");
    }

    rl.close();
  } catch (err) {
    console.error("\n❌ Error getting token:", err.message);
    rl.close();
  }
});
