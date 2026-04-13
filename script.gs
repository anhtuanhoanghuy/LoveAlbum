function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Logs");

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.event,
    data.image || "",
    data.userAgent || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const folderId = "1LraRpvcMeQHQeaiT-sQB9nRHiq30W0Xc";
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  const images = [];

  while (files.hasNext()) {
    const file = files.next();
    images.push({
      name: file.getName(),
      url: "https://drive.google.com/thumbnail?id=" + file.getId()
    });
  }

  const callback = e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(images) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(images))
    .setMimeType(ContentService.MimeType.JSON);
}