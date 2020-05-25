const { dbClient, collections } = require('..');
const oldRecords = require('./old-records');

/* eslint-disable no-console */
(async () => {
  if (require.main === module) {
    try {
      console.log('Connecting with database server');
      await dbClient.connect();

      console.log('Setting blank "createdAt"');
      const formsCollection = dbClient.db.collection(collections.FORMS);

      const { result } = await formsCollection.updateMany(
        { id: { $in: oldRecords } }, // Query
        { // UpdateQuery
          $unset: {
            createdAt: '',
          },
        },
      );
      console.log(result);
    } catch (error) {
      console.error(`Failed to clean up old data records, ${error}`);
    }
  }
})();
/* eslint-enable no-console */
