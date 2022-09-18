const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const UserApi = express.Router();
const User = require("../models/user");
const Customer = require("../models/customer");
const userValidation = require("../validations/userVal");
const auth = require("../middleware/auth");

UserApi.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
UserApi.put("/me", auth, async (req, res) => {
  let currentUser = req.body;

  let user = await User.findById(req.user._id);

  if (req.body.liked) {
    user.liked = currentUser.liked;
  }

  if (req.body.isCustomer) {
    user.isCustomer = currentUser.isCustomer;
  }
  if (req.body.rented) {
    user.rented = currentUser.rented;
  }
  if (req.body.name) {
    user.name = currentUser.name;
  }

  if (req.body.customerId) {
    console.log(req.body.customerId);
    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
      return res.status(404).send("Customer not found in our list");

    user.customer = customer;
  }

  await user.save();

  console.log(user);
  res.send(user);
});

UserApi.post("/", async (req, res) => {
  console.log(req);

  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(
    _.pick(req.body, [
      "name",
      "email",
      "password",
      "liked",
      "isCustomer",
      "rented",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.isCustomer = false;
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = UserApi;
