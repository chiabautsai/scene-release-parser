// netlify/functions/parser.js

// Use ES Module 'import' syntax
import ReleaseParser from '../../ReleaseParser.js';

// Use ES Module 'export' syntax for the handler
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
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
