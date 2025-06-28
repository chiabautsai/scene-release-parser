// netlify/functions/parser.js

// Import the main parser function from the ReleaseParser.js file in the root directory.
const ReleaseParser = require('../../ReleaseParser.js');

exports.handler = async function(event) {
  // We only want to handle POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Parse the incoming request body to get the release name.
    const { releaseName, section } = JSON.parse(event.body);

    // Check if the releaseName was provided.
    if (!releaseName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'releaseName is required' }),
      };
    }

    // Use the ReleaseParser function with the provided release name and optional section.
    const release = ReleaseParser(releaseName, section);

    // Return the parsed data as a JSON response.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(release),
    };
  } catch (error) {
    // If anything goes wrong, return an error.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
