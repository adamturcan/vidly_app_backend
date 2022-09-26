const auth = require("../middleware/auth");
const express = require("express");
const Customer = require("../models/customer");
const CustomerValidation = require("../validations/customerVal");
const CustomerApp = express.Router();

CustomerApp.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

CustomerApp.post("/", auth, async (req, res) => {
  console.log("this is working");
  const { error } = CustomerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
    rents: [],
  });
  customer = customer.save().catch(() => res.send("invalid format"));
  res.send(await customer);
});

CustomerApp.get("/:id", async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Customer not found in our list");
  }

  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("customer not found :(");

  res.send(customer);
});

CustomerApp.put("/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Customer not found in our list");
  }

  const { error } = CustomerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send("customer not found :(");

  customer.rents = [...req.body.rents];
  customer.isGold = req.body.isGold;
  await customer.save();
  res.send(customer);
});

CustomerApp.delete("/:id", auth, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).send("Customer not found in our list");
  }

  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send("customer not found :(");

  res.send(customer);
});

module.exports = CustomerApp;
