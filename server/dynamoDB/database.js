const AWS = require('aws-sdk');
const schema = require('./schema.js');

// Run DynamoDB locally: docker run -p 8000:8000 amazon/dynamodb-local
const databaseSuffix = process.env.DB_SUFFIX || 'development';
const nodeEnv = process.env.NODE_ENV || 'development';
AWS.config.update({
  region: 'ca-central-1',
  ...(['development', 'test'].includes(nodeEnv) && { endpoint: 'http://localhost:8000' }),
});
const db = new AWS.DynamoDB();
const dbClient = new AWS.DynamoDB.DocumentClient();

// If run directly, will set up local DB
/* eslint-disable no-console */
(async () => {
  if (require.main === module) {
    try {
      console.log('Checking for DB tables');
      const tables = await db.listTables().promise();
      if (nodeEnv !== 'development' && nodeEnv !== 'test') {
        console.error('Environment variable NODE_ENV must be set to either development or test');
        return;
      }

      if (Array.isArray(tables.TableNames) && tables.TableNames.length > 0) {
        console.log('DB tables already exist');
        return;
      }
      schema.forEach(async (s) => {
        console.log(`Creating table ${s.TableName}`);
        await db.createTable(s).promise();
      });
      console.log('Waiting 10s for tables to be created');
      await (async (ms = 10000) => new Promise((resolve) => setTimeout(resolve, ms)))();
    } catch (error) {
      console.error(`Failed to create tables and/or user ${error}`);
    }
  }
})();
/* eslint-enable no-console */

module.exports = {
  db: dbClient,
  greetingsTable: `ssp-greetings-${databaseSuffix}`,
};
