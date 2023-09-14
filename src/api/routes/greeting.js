const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const AWS = require("aws-sdk");

AWS.config.update({
  region:
    process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ca-central-1",
  endpoint: process.env. || "http://localhost:4566",
});

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

// GET /api/v1/greetings
router.get("/latest", async (req, res) => {
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.DYNAMODB_TABLE_NAME,
      })
      .promise();

    if (!result.Items) {
      return res.status(500).json({ message: "No items found" });
    }

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
