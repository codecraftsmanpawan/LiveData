const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const socketIoClient = require("socket.io-client");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
http: require("./mongoscoon.js");

const Stock = require("./stocks.js");


// Environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket configuration
const apiSocketUrl = "https://live2.nselivedata.in:4623";
const accessKey = "674eccea74b12b1b4903af4219c58f28";

// Initialize WebSocket client
const apiSocket = socketIoClient(apiSocketUrl, {
  transports: ["websocket"],
});

// WebSocket event handling
apiSocket.on("connect", () => {
  console.log("Connected to API WebSocket");

  // Authenticate WebSocket connection
  apiSocket.emit("authentication", { access_key: accessKey });

  // Handle LiveDataMCX event
  apiSocket.on("LiveDataMCX", async (data) => {
    await handleLiveData(data);
  });

  // Handle LiveDataNSE event
  apiSocket.on("LiveDataNSE", async (data) => {
    await handleLiveData(data);
  });
});

// Function to handle and update live data
const handleLiveData = async (data) => {
  try {
    const { product } = data;

    const existingStock = await Stock.findOne({ product });

    if (!existingStock) {
      // Create a new stock if it does not exist
      const newStock = new Stock(data);
      await newStock.save();
    } else {
      // Update existing stock with new data
      await Stock.updateOne({ product }, { $set: data });
    }
  } catch (error) {
    console.error("Error updating stocks:", error);
  }
};

// Start Express server
app.listen(8080, () => {
  console.log(`Server is running at http://localhost:8080`);
});
