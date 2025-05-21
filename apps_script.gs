# Turn lat longs from a sheet into a geojson
# This is a backup of what is in the Google Apps Script here:
#https://script.google.com/u/0/home/projects/1TlnNqo8uoSX29xdMSFjSPFFrEI-6xyOaCt2qtUxt7VsgY1DMdfFpyE4X/edit
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const latIndex = headers.indexOf("latitude");
  const lonIndex = headers.indexOf("longitude");
  const noteIndex = headers.indexOf("notes"); // change this if needed

  const features = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const lat = parseFloat(row[latIndex]);
    const lon = parseFloat(row[lonIndex]);
    if (!lat || !lon) continue;

    const props = {
      id: i,
      note: row[noteIndex],
      lat: lat,
      lon: lon,
    };

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lon, lat]
      },
      properties: props
    });
  }

  const geojson = {
    type: "FeatureCollection",
    features: features
  };

  return ContentService
    .createTextOutput(JSON.stringify(geojson))
    .setMimeType(ContentService.MimeType.JSON);
}
