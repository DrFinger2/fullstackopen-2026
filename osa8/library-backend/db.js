require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

const connectToDatabase = async (uri) => {
  if (process.env.IS_LOCAL_NETWORK) {
    // Doing this because im having trouble connecting to mongodb if from home compter otherwise.
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("\nDNS was set, running on local network!\n");
  }

  console.log("connecting to database URI:", uri);
  try {
    await mongoose.connect(uri);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log("error connection to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
