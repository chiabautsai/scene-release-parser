// netlify/functions/parser.js

// Import the entire module as a namespace.
import * as ReleaseParserModule from '../../ReleaseParser.js';

// Explicitly get the function from the 'default' export.
const ReleaseParser = ReleaseParserModule.default;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // Check if ReleaseParser is actually a function before calling it
    if (typeof ReleaseParser !== 'function') {
      throw new Error('ReleaseParser could not be loaded as a function.');
    }

    const { releaseName, section } = JSON.parse(event.body);

    if (!releaseName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'releaseName is required' }),
      };
    }

    const release = ReleaseParser(releaseName, section);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(release),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
