/* eslint-disable */
const AWS = require('aws-sdk');
const { dbClient, collections } = require('..');

// Run DynamoDB locally: docker run -p 8000:8000 amazon/dynamodb-local
const databaseSuffix = process.env.DB_SUFFIX || 'development';
const nodeEnv = process.env.NODE_ENV || 'development';
AWS.config.update({
  region: 'ca-central-1',
  ...(nodeEnv === 'development' && {
    endpoint: 'http://dynamoDB:8000',
    accessKeyId: 'Abc', // Must be not null
    secretAccessKey: 'Abc', // Must be not null
  }),
});
const db = new AWS.DynamoDB();
const dynamoClient = new AWS.DynamoDB.DocumentClient();

// DynamoDB
const greetingsTable = `ssp-greetings-${databaseSuffix}`;

const keypress = async () => {
  process.stdin.setRawMode(false);
  return new Promise((resolve) => process.stdin.once('data', (chunk, key) => {
    if (key && key.name === 'c' && key.ctrl) {
      console.log('Aborting...');
      return process.exit();
    }
    resolve();
  }));
};

async function migrateGreetings() {
  const greetingsCollection = dbClient.db.collection(collections.GREETINGS);

  // This could be improved by using a paginated scan but
  // considering we have less than 2MB of data, this should be okay
  console.log('Loading DynamoDB users into memory...');
  const dynamoGreetings = await dynamoClient.scan({
    TableName: greetingsTable,
  }).promise();

  console.log('\nMigrating greetings...');
  const totalGreetings = dynamoUsers.Count;
  let processedGreetings = 0;
  let addedGreetings = 0;
  let redundantGreetings = 0;
  let failedGreetings = 0;

  if (dynamoUsers.Items) {
    for (const item of dynamoGreetings.Items) {
      try {
        // Check if user exists in MongoDB
        await greetingsCollection.insertOne(
          {
            greeting: item.id,
          },
        );

        addedGreetings += 1;
      } catch (err) {
        // Failed due to duplicated Key
        if (err.code === 11000) {
          redundantGreetings += 1;
        } else {
          console.log('Failed to migrate item: ', item, err);
          failedGreetings += 1;
        }
      }

      processedGreetings += 1;
    }
  }

  console.log('Greeting Migration summary\n', {
    totalGreetings, processedGreetings, addedGreetings, redundantGreetings, failedGreetings,
  });
}

/* eslint-disable no-console */
(async () => {
  if (require.main !== module) {
    console.error('Migration module cannot be imported.');
    return process.exit();
  }

  try {
    console.log('Starting db migration');

    console.log('Current mongo config are: ');
    dbClient.printConfig();

    console.log('\nCurrent dynamoDB config are: ');
    console.log({ endpoint: AWS.config.endpoint }, '\n');

    console.log('\n\nDouble check configuration.\nPress any key to continue or CTRL + C to abort.');
    await keypress();

    console.log('Connecting with mongo db...\n');
    await dbClient.connect();

    console.log('Verifying DynamoDB tables...\n');
    const tables = await db.listTables().promise();

    console.log(tables);
    if (!Array.isArray(tables.TableNames)
      || !tables.TableNames.includes(formsTable)
      || !tables.TableNames.includes(usersTable)
    ) {
      console.log('Missing DynamoDB tables\n');
      return process.exit();
    }

    await migrateGreetings();

    process.exit();
  } catch (err) {
    console.error('Migration script failed with: ', err);
  }
})();
/* eslint-enable no-console */
