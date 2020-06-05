const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { randomBytes } = require('crypto');
const { passport } = require('./auth.js');
const requireHttps = require('./require-https.js');
const {
  validate, GreetingSchema,
} = require('./validation.js');
const { dbClient, collections } = require('./db');
const { errorHandler, asyncMiddleware } = require('./error-handler.js');
const logger = require('./logger.js');

const apiBaseUrl = '/api/v1';
const app = express();

//app.use(requireHttps);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Remove empty strings (DynamoDB doesn't accept)
const scrubObject = (obj) => {
  const scrubbed = obj;
  Object.keys(scrubbed).forEach((key) => {
    if (typeof scrubbed[key] === 'object' && scrubbed[key] !== null) {
      scrubbed[key] = scrubObject(scrubbed[key]); // Nested object
    } else if (scrubbed[key] === '') {
      scrubbed[key] = null; // Null instead of empty for DynamoDB
    }
  });
  return scrubbed;
};

const generateUniqueHexId = async (collection) => {
  const randomHexId = randomBytes(4).toString('hex').toUpperCase();
  if (await collection.countDocuments({ id: randomHexId }, { limit: 1 }) > 0) {
    return generateUniqueHexId(collection); // Ensure ID is unique
  }
  return randomHexId;
};

// Choose and save greeting
app.post(`${apiBaseUrl}/greeting`,
  asyncMiddleware(async (req, res) => {
    const scrubbed = scrubObject(req.body);
    await validate(GreetingSchema, scrubbed); // Validate submitted form against schema
    const greetingsCollection = dbClient.db.collection(collections.GREETINGS);
    const id = await generateUniqueHexId(greetingsCollection);

    // Boolean indicating if user really have an isolation plan
    const isolationPlanStatus = scrubbed.accomodations
      && scrubbed.ableToIsolate && scrubbed.supplies;

    const currentIsoDate = new Date().toISOString();
    const formItem = {
      ...scrubbed,
      id,
      isolationPlanStatus,
      determination: null,
      notes: null,
      createdAt: currentIsoDate,
      updatedAt: currentIsoDate,
    };


    await formsCollection.insertOne({
      ...formItem,
      // Following NoSQL recommendation, in this case, we want to store
      // BC Services transactional data on the form itself
      serviceBCTransactions: [
        {
          ...serviceResponse,
          processedAt: new Date().toISOString(),
        },
      ],
    });

    return res.json({ id, isolationPlanStatus });
  }));


// Get existing greeting
app.get(`${apiBaseUrl}/greeting/:id`,
  passport.authenticate('jwt', { session: false }),
  asyncMiddleware(async (req, res) => {
    const { id } = req.params;
    const greetingsCollection = dbClient.db.collection(collections.GREETINGS);
    const greetingItem = await greetingsCollection.findOne({ id });

    if (!greetingItem) return res.status(404).json({ error: `No submission with ID ${id}` });

    return res.json(greetingItem);
  }));

// Client app
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
}

app.use(errorHandler);

module.exports = app;
