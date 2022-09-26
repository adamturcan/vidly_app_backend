const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const customerSchema = new mongoose.Schema({
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
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  isAdmin: Boolean,
  liked: [String],
  isCustomer: Boolean,
  customer: { type: customerSchema, required: false },
  rented: [String],
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      name: this.name,
      isCustomer: this.isCustomer,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
