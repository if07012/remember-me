import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

export async function getGoogleSheet(spreadsheetId: string) {
  const doc = new GoogleSpreadsheet(spreadsheetId, jwt);
  await doc.loadInfo();
  return doc;
}

export async function readSheetData(spreadsheetId: string, sheetName?: string) {
  try {
    const doc = await getGoogleSheet(spreadsheetId);
    const sheet = sheetName ? doc.sheetsByTitle[sheetName] : doc.sheetsByIndex[0];

    if (!sheet) {
      throw new Error(sheetName ? `Sheet "${sheetName}" not found` : 'No sheets found in the document');
    }

    const rows = await sheet.getRows();
    return rows.map(row => row.toObject());
  } catch (error) {
    console.error('Error reading from Google Sheet:', error);
    throw error;
  }
}

export async function appendSheetData(
  spreadsheetId: string,
  data: Record<string, any>[],
  sheetName?: string
) {
  try {
    const doc = await getGoogleSheet(spreadsheetId);
    const sheet = sheetName ? doc.sheetsByTitle[sheetName] : doc.sheetsByIndex[0];
    await sheet.addRows(data);
    return { success: true, message: 'Data added successfully' };
  } catch (error) {
    console.error('Error writing to Google Sheet:', error);
    throw error;
  }
}

export async function updateSheetData(
  spreadsheetId: string,
  rowIndex: number,
  data: Record<string, any>,
  sheetIndex = 0
) {
  try {
    const doc = await getGoogleSheet(spreadsheetId);
    const sheet = doc.sheetsByIndex[sheetIndex];
    const rows = await sheet.getRows();

    if (rowIndex >= rows.length) {
      throw new Error('Row index out of bounds');
    }

    const row = rows[rowIndex];
    Object.entries(data).forEach(([key, value]) => {
      row[key] = value;
    });
    await row.save();

    return { success: true, message: 'Row updated successfully' };
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    throw error;
  }
} 