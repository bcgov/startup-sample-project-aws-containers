const schemaFile = require('./schema');
const dbFile = require('./db');


module.exports = {
  ...dbFile,
  ...schemaFile,
};
