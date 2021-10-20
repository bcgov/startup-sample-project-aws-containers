const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const path = require("path");
const { randomBytes } = require("crypto");
const { passport } = require("./auth.js");
const requireHttps = require("./require-https.js");
const { validate, GreetingSchema } = require("./validation.js");
let dbClient = null;
let collections = null;
let dynamodbClient = null;
if ("development" === process.env.NODE_ENV) dbClient = require("./db").dbClient;
if ("development" === process.env.NODE_ENV)
  collections = require("./db").collections;
if ("development" !== process.env.NODE_ENV)
  dynamodbClient = require("./db").dynamodbClient;
const { errorHandler, asyncMiddleware } = require("./error-handler.js");
const logger = require("./logger.js");

const apiBaseUrl = "/api/v1";
const app = express();

if ("true" === process.env.HTTPS) app.use(requireHttps);
app.use(bodyParser.json());
if ("development" !== process.env.NODE_ENV) {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.use(favicon(path.join(__dirname, "../client/build", "favicon.ico")));
}

// Remove empty strings (DynamoDB doesn't accept)
const scrubObject = (obj) => {
  const scrubbed = obj;
  Object.keys(scrubbed).forEach((key) => {
    if (typeof scrubbed[key] === "object" && scrubbed[key] !== null) {
      scrubbed[key] = scrubObject(scrubbed[key]); // Nested object
    } else if (scrubbed[key] === "") {
      scrubbed[key] = null; // Null instead of empty for DynamoDB
    }
  });
  return scrubbed;
};

const generateUniqueHexId = async (collection) => {
  const randomHexId = randomBytes(4).toString("hex").toUpperCase();
  if (
    (await collection.countDocuments({ id: randomHexId }, { limit: 1 })) > 0
  ) {
    return generateUniqueHexId(collection); // Ensure ID is unique
  }
  return randomHexId;
};

// Choose and save greeting
app.post(
  `${apiBaseUrl}/greeting`,
  asyncMiddleware(async (req, res) => {
    if ("development" === process.env.NODE_ENV) {
      const scrubbed = scrubObject(req.body);
      await validate(GreetingSchema, scrubbed); // Validate submitted form against schema
      const greetingsCollection = dbClient.db.collection(collections.GREETINGS);
      const id = await generateUniqueHexId(greetingsCollection);
      const currentIsoDate = new Date().toISOString();
      const greetingItem = {
        ...scrubbed,
        id,
        createdAt: currentIsoDate,
        updatedAt: currentIsoDate,
      };

      logger.info("Saving to db: " + JSON.stringify(greetingItem));

      const greeting = req.body["greeting"];
      await greetingsCollection.insertOne({
        ...greetingItem,
      });

      return res.json({ id, greeting });
    } else {
      logger.info("Saving to db: " + JSON.stringify(req.body));

      const greeting = req.body["greeting"];
      const result = await dynamodbClient.addGreeting(greeting);
      const id = result.id;

      return res.json({ id, greeting });
    }
  })
);

// Get existing greeting
app.get(
  `${apiBaseUrl}/greeting/:latest`,
  asyncMiddleware(async (req, res) => {
    if ("development" === process.env.NODE_ENV) {
      const greetingsCollection = dbClient.db.collection(collections.GREETINGS);
      const greetingItems = await greetingsCollection
        .find({}, { sort: { $natural: -1 }, limit: 10 })
        .toArray();
      logger.info("Reading from db: " + JSON.stringify(greetingItems));
      return res.json({ greetingItems });
    } else {
      const greetingItems = await dynamodbClient.getGreetings();
      logger.info("Reading from db: " + JSON.stringify(greetingItems));
      return res.json({ greetingItems });
    }
  })
);

// Client app
if (process.env.NODE_ENV === "production") {
  app.get("/*", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
  );
}

app.use(errorHandler);

module.exports = app;
