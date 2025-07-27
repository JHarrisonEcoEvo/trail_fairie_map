# Turn lat longs from a sheet into a geojson
# This is a backup of what is in the Google Apps Script here:
#https://script.google.com/home/projects/1ag60c_quDHGdiYfIH3f6wMdyN1nM2LdehsDXIhKWvIS6ZhcB-r72FAvI/edit

# This script is tied to the Google sheet via going to the sheet and clicking Extensions>Apps
# also you can find it under the Google Apps app from Josh's trail fairies Google account
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const latIndex = headers.indexOf("Latitude");
  const lonIndex = headers.indexOf("Longitude");
  const noteIndex = headers.indexOf("Trail damage type"); // adjust if your column name is different
  const fixedIndex = headers.indexOf("Is the problem fIxed"); // NEW

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
      fixed: row[fixedIndex] // NEW
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
