var extractSheets = require('spreadsheet-to-json').extractSheets;
var fs = require('fs');

// Define your spreadsheet ID
var SPREADSHEET_ID = '15anTEDyyPAnACj_YDXxMVXmee9ApJcZMkoJKvnQNIR4';

// Extract data from the spreadsheet
extractSheets({
  spreadsheetKey: SPREADSHEET_ID,
  credentials: process.env.GOOGLE_SHEETS_API_KEY, // Assuming you've stored the API key as an environment variable
  sheetsToExtract: ['Sheet1'], // Modify this to match your sheet name
})
  .then(function (result) {
    // We only need the data from Sheet1.
    var brothers = result.Sheet1;

    // Adjust property names if necessary
    brothers = brothers.map(function (bro) {
      if (bro.familyStarted) {
        bro.familystarted = bro.familyStarted;
        delete bro.familyStarted;
      }
      // Convert 'TRUE' strings to booleans
      Object.keys(bro).forEach(function (key) {
        if (bro[key] === 'TRUE') {
          bro[key] = true;
        }
      });
      // Remove empty fields
      Object.keys(bro).forEach(function (key) {
        if (bro[key] === null || bro[key] === undefined) {
          delete bro[key];
        }
      });
      return bro;
    });

    // Convert the result to a JavaScript file
    var jsData = 'var brothers = ' + JSON.stringify(brothers, undefined, 2) + ';\n';

    // Write the data to a file
    fs.writeFileSync('relations.js', jsData);

    console.log('Data extracted and saved successfully to relations.js');
  })
  .catch(function (err) {
    console.error('Error extracting data from spreadsheet: ' + err.message);
    process.exit(1);
  });
