const { dbClient } = require('..');

/* eslint-disable no-console */
(async () => {
  if (require.main === module) {
    try {
      console.log('Connecting with database server');
      await dbClient.connect();
    } catch (error) {
      console.error(`Failed to clean up old data records, ${error}`);
    }
  }
})();
/* eslint-enable no-console */
