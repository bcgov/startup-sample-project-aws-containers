const AWS = require("aws-sdk");
const fs = require('fs');
const logger = require('../logger.js');
const { randomBytes } = require('crypto');

/**
 * This utility module provides helper methods to allow the application
 * to easily interact with a DocumentDB/MongoDB database
 */
class DynamoDBClient {
  constructor() {
    
    this.db = null;
    this._docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
  }
    
  /**
   * Return config variables
   *
   * @returns
   * @memberof DBClient
   */
  static config() {
    return {      
      dbName: process.env.DB_NAME || 'development'      
    };
  }

  
  async generateUniqueHexId() {
    return new Promise(resolve => {
      const randomHexId = randomBytes(4).toString('hex').toUpperCase();
      const {       
        dbName,
      } = DynamoDBClient.config();

      var params = {
        Key: {
        "id":  randomHexId          
        }, 
        TableName: dbName
      };

       this._docClient.get(params, function(err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
          resolve(params.Key["id"]);
          
        }
        else {
          if (data.Item == null) {
            resolve(params.Key["id"]);
          } else {
            resolve(generateUniqueHexId());
          }
        }
      });

    });
  };
  

  async getGreetings() {
    return new Promise(resolve => {

        const {       
            dbName,
          } = DynamoDBClient.config();
          
        var params = {
            TableName: dbName,
            KeyConditionExpression: "pid = :pid",
            ExpressionAttributeValues: {
              ":pid":  "greetings"
            },
            ScanIndexForward: false,
            Limit: 10
          };
        this._docClient.query(params, function(err, data) {
            if (err) {
              console.log("Unable to get item");            
            } else {
              resolve(data.Items);
            }
            resolve();            
        });      
    });
  }


  async addGreeting(greeting) {
    const id = await this.generateUniqueHexId();

    return new Promise(resolve => {

      const {       
        dbName,
      } = DynamoDBClient.config();

      const currentIsoDate = new Date().toISOString();
      
      var params = {
        TableName: dbName,
        Item:{
            "pid": "greetings",
            "id": id,
            "createdAt": currentIsoDate,
            "updatedAt": currentIsoDate,
            "greeting": greeting
        }
      };

      logger.info('Data to write: ' + JSON.stringify(params));

      this._docClient.put(params, function(err, data) {
          if (err) {
            logger.info("Unable to add item:", err);    
            resolve();        
          } else {            
            resolve(params.Item);
          }                    
      });      

    });
  }

}

DynamoDBClient.instance = new DynamoDBClient();

module.exports = {
  dynamodbClient: DynamoDBClient.instance,
};
