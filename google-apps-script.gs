/**
 * S&W Plumbing — quote form → Google Sheet
 * ------------------------------------------------------------------
 * Paste this into a Google Sheet's Apps Script editor and deploy it as a
 * Web app. The website's quote form POSTs each enquiry here and it appends a
 * row. See SHEETS-SETUP.md for the click-by-click steps.
 *
 * Deploy settings that MUST be used:
 *   Execute as:      Me
 *   Who has access:  Anyone
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');

    // Add a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received', 'Name', 'Phone', 'Suburb', 'Service', 'Message']);
    }

    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.name || '',
      p.phone || '',
      p.suburb || '',
      p.service || '',
      p.message || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the /exec URL in a browser to confirm it's deployed.
function doGet() {
  return ContentService
    .createTextOutput('S&W Plumbing lead endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
