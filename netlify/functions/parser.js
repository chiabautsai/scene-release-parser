// netlify/functions/parser.js

// Import the module. The name 'ReleaseParserModule' is used to show it's the whole module.
import ReleaseParserModule from '../../ReleaseParser.js';

// This is the key change. In some bundlers, the default export is on the .default
// property. In others, it's the module itself. This line handles both cases.
const ReleaseParser = ReleaseParserModule.default || ReleaseParserModule;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    // We'll add a very detailed error message in case it still fails.
    if (typeof ReleaseParser !== 'function') {
      throw new Error(
        `Failed to load ReleaseParser as a function. The imported module type is '${typeof ReleaseParserModule}' and its content is: ${JSON.stringify(ReleaseParserModule)}`
      );
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
