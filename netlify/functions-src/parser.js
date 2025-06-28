// netlify/functions-src/parser.js

// Import ReleaseParser from the project root. esbuild will resolve this.
import ReleaseParser from '../../ReleaseParser.js';

export const handler = async (event) => {
  // We only want to handle POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { releaseName, section } = JSON.parse(event.body);

    // Check if the releaseName was provided.
    if (!releaseName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'releaseName is required' }),
      };
    }

    // Call the ReleaseParser function
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
    console.error("Function error:", error); // Log the error for debugging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "An unknown error occurred." }),
    };
  }
};
