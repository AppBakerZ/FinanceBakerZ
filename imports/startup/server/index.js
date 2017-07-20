// import server startup through a single index entry point

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';

import './email.js';
import './aws.js';
import './logger.js'