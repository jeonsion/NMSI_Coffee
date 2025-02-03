const mongoose = require("mongoose");

const CoffeeRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CoffeeRecord", CoffeeRecordSchema, "coffeeRecords");