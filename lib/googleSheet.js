import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
// Handle Private Key formatting for Vercel and Local .env
// If the key is wrapped in quotes, they are removed.
// \n characters are replaced with actual newlines.
const PRIVATE_KEY_ENV = process.env.GOOGLE_PRIVATE_KEY || "";
const GOOGLE_PRIVATE_KEY = PRIVATE_KEY_ENV.replace(/\\n/g, '\n').replace(/"/g, '');

const serviceAccountAuth = new JWT({
  email: GOOGLE_CLIENT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

export async function getSheet(title) {
  await doc.loadInfo();
  return doc.sheetsByTitle[title];
}
