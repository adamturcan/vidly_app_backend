const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    isGold: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlenght: 5,
    },
    phone: {
      type: String,
      required: true,
    },
    rents: [String],
  })
);

module.exports = Customer;
