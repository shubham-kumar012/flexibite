import { google } from 'googleapis';

/**
 * Creates and returns an instance of Google's OAuth2Client using credentials from environment variables.
 */
export const getGoogleOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5002/api/auth/google/callback';

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

/**
 * Generates the Google authorization URL for user login.
 * Requests basic user profile, email, and openid scopes.
 */
export const getGoogleAuthUrl = () => {
  const oauth2Client = getGoogleOAuthClient();

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
};

/**
 * Exchanges authorization code for tokens and retrieves user profile details from Google.
 * @param {string} code Authorization code from Google callback
 * @returns {Promise<{ googleId: string, email: string, name: string, picture: string }>}
 */
export const getGoogleUserInfo = async (code) => {
  const oauth2Client = getGoogleOAuthClient();

  // Exchange authorization code for Google access tokens
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch Google user profile using Google OAuth2 API
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  const { data } = await oauth2.userinfo.get();

  return {
    googleId: data.id,
    email: data.email,
    name: data.name,
    picture: data.picture || '',
  };
};
