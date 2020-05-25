const { MongoClient } = require('mongodb');
const fs = require('fs');
const logger = require('../logger.js');

/**
 * This utility module provides helper methods to allow the application
 * to easily interact with a DocumentDB/MongoDB database
 */
class DBClient {
  constructor() {
    /**
     * DB Connection
     *
     * @type {MongoClient|null}
     * @memberof DB
     */
    this._connection = null;

    /**
     * Current Database
     *
     * @type {Db|null}
     * @memberof DB
     */
    /** eslint-disable-next-line */
    this.db = null;
  }

  /**
   * Return config variables
   *
   * @returns
   * @memberof DBClient
   */
  static config() {
    return {
      dbServer: process.env.DB_SERVER || 'localhost',
      dbPort: process.env.DB_PORT || '27017',
      dbUser: process.env.DB_USER || 'development',
      dbPassword: process.env.DB_PASSWORD || 'development',
      dbName: process.env.DB_NAME || 'development',
      dbTLSEnabled: process.env.DB_AWS_TLS_ENABLED === 'true',
      useReplicaSet: process.env.DB_USE_REPLICA_SET === 'true',
    };
  }

  /**
   * Console log current configuration but password
   */
  printConfig() {
    const { dbPassword, ...config } = this.constructor.config();
    console.log(config); // eslint-disable-line no-console
  }

  /**
   * Connect to database
   *
   * @returns {Promise<void>}
   * @memberof DB
   */
  async connect() {
    if (this._connection) return;

    const {
      dbServer,
      dbPort,
      dbUser,
      dbPassword,
      dbName,
      dbTLSEnabled,
      useReplicaSet,
    } = this.constructor.config();

    // https://docs.aws.amazon.com/documentdb/latest/developerguide/connect-from-outside-a-vpc.html

    const uri = `mongodb://${dbUser}:${dbPassword}@${dbServer}:${dbPort}/${dbName}`;

    /** @type {MongoClientOptions} */
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (dbTLSEnabled) {
      options.ssl = true;
      options.sslValidate = true;
      // Specify the Amazon DocumentDB cert
      options.sslCA = [fs.readFileSync(`${__dirname}/certificates/rds-combined-ca-bundle.pem`)];
    }

    // Create a MongoDB client opening a connection to Amazon DocumentDB as a replica set,
    // and specify the read preference as secondary preferred following AWS best practices
    // https://docs.aws.amazon.com/documentdb/latest/developerguide/connect-to-replica-set.html
    if (useReplicaSet) {
      options.readPreference = 'secondaryPreferred';
      options.replicaSet = 'rs0';
    }

    try {
      this._connection = await MongoClient.connect(uri, options);
      this.db = this._connection.db(dbName);
    } catch (err) {
      logger.error(`Failed to connect to database: ${err}`);
      throw new Error('DBError');
    }
  }

  /**
   * Change database being used
   *
   * @param {*} database
   * @memberof DBClient
   */
  useDB(database) {
    this.db = this._connection.db(database);
  }

  /**
     * Disconnect from database
     *
     * @returns
     * @memberof DB
     */
  async disconnect() {
    if (!this._connection) return;

    try {
      await this._connection.close();
    } catch (err) {
      logger.error(`Failed to disconnect from database: ${err}`);
    }
  }
}

DBClient.instance = new DBClient();

module.exports = {
  dbClient: DBClient.instance,
};
