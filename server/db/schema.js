/**
 * Define db schema rules including collection names and indexes
 */

const collections = {
  FORMS: 'ets-forms',
  PHAC: 'ets-phac',
  USERS: 'ets-users',
};

const schema = [
  {
    collection: collections.USERS,
    indexes: [
      { key: 'username', options: { unique: true } },
    ],
  },
  {
    collection: collections.PHAC,
    indexes: [
      { key: 'id', options: { unique: true } },
    ],
  },
  {
    collection: collections.FORMS,
    indexes: [
      { key: 'id', options: { unique: true } },
      { key: 'lastName', options: {} },
      { key: 'createdAt', options: {} },
      { key: 'serviceResponse.processedAt', options: {} },
    ],
  },
];

module.exports = {
  collections,
  schema,
};
