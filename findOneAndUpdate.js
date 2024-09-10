const mongoose = require("mongoose");
const Stock = require("./stocks");

// Function to check if current time is between 3:30 PM and 11:30 PM
const isTimeBetween = (startTime, endTime) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  
  // Set the time for start (3:30 PM) and end (11:30 PM)
  start.setHours(startTime.hours, startTime.minutes, 0); 
  end.setHours(endTime.hours, endTime.minutes, 0); 
  return now >= start && now <= end;
};


const updateStockPrices = async () => {
  try {

    const startTime = { hours: 15, minutes: 30 }; 
    const endTime = { hours: 11, minutes: 30 };

    // Check if current time is between 3:30 PM and 11:30 PM
    if (isTimeBetween(startTime, endTime)) {
      // Find the stock for the NSE exchange
      const stock = await Stock.findOne({ Exchange: "NSE" });

      if (stock) {
        // Update the BuyPrice and SellPrice according to the Close price
        stock.BuyPrice = stock.Close;  
        stock.SellPrice = stock.Close; 
        
        // Save the updated stock
        await stock.save();
        console.log("Stock prices updated successfully.");
      } else {
        console.log("No stock found for NSE exchange.");
      }
    } else {
      console.log("Current time is not between 3:30 PM and 11:30 PM.");
    }
  } catch (error) {
    console.error("Error updating stock prices:", error);
  }
};

// Call the function to check and update stock prices
updateStockPrices();
