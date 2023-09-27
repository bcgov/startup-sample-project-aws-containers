const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const AWS = require("aws-sdk");

var aws_config = {};

if (process.env.LOCALSTACK_ENDPOINT) {
  aws_config = {
    region:
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      "ca-central-1",
    endpoint: process.env.LOCALSTACK_ENDPOINT,
  };
} else {
  aws_config = {
    region:
      process.env.AWS_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      "ca-central-1",
  };
}

console.log("aws_config", aws_config);

AWS.config.update(aws_config);

const dynamodb = new AWS.DynamoDB.DocumentClient();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

// POST /api/v1/greeting
router.post("/", async (req, res) => {
  try {
    const { greeting } = req.body;

    if (!greeting) {
      return res.status(400).json({ message: "Greeting is required" });
    }

    const item = {
      id: crypto.randomBytes(16).toString("hex"),
      greeting,
      createdAt: new Date().toISOString(),
    };

    await dynamodb
      .put({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: item,
      })
      .promise();

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/v1/greetings/latest
router.get("/latest", async (req, res) => {
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.DYNAMODB_TABLE_NAME,
      })
      .promise();

    const greetings = result.Items.map((item) => ({
      id: item.id,
      greeting: item.greeting,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.json({ greetingItems: greetings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving greetings" });
  }
});

module.exports = router;
