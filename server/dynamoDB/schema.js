const databaseSuffix = process.env.NODE_ENV === 'test' ? 'test' : process.env.DB_SUFFIX || 'development';

module.exports = [
  {
    TableName: `ssp-greetings-${databaseSuffix}`,
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
];
