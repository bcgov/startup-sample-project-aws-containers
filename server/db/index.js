const schemaFile = require('./schema');
const dbFile = require('./db');
const dbDynamo = require('./dynamodb');


module.exports = {
  ...dbFile,
  ...dbDynamo,
  ...schemaFile,
};
