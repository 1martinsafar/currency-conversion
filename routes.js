// a module to handle the routes for stats
"use strict";

const express = require("express");
const router = express.Router();

const fs = require("fs");
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);
console.log(stats);

// 1.
// GET the Most popular destination currency
router.get("/popular", (req, res) => {
  console.log(">>> Getting MOST POPULAR.");
  res.json(stats.mostPopular);
});

// TO DO: POST
// TO DO: PUT

// 2.
// GET the 2. Total amount converted (in USD)
router.get("/amount", (req, res) => {
  console.log(">>> Getting TOTAL AMOUNT.");
  res.json(stats.amountConverted);
});

// PUT
router.put("/amount/:number", (req, res) => {
  console.log(">>> Updating TOTAL AMOUNT.");
  console.log("BEFORE: ", stats["amountConverted"]);
  const amount = Number(req.params.number);

  let reply;

  if (!amount) {
    reply = {
      msg: "An amount is required."
    }
  response.send(reply);
  } else {
    stats["amountConverted"] += amount;
    const data = JSON.stringify(stats, null, 2);
    fs.writeFile("stats.json", data, err => {
      if (err) {
        throw err;
      } else {
        reply = {
          amountAdded: amount
        }
        console.log("The AMOUNT has been updated.");
        console.log("AFTER: ", stats["amountConverted"]);
      }
      res.send(reply);
    });
  }
});

// 3.
// GET the 3. Total number of conversion requests made
router.get("/conversions", (req, res) => {
  console.log(">>> Getting NUMBER OF CONVERSIONS.");
  res.json(stats.requestsNumber);
});

// TO DO: PUT
router.put("/amount", (req, res) => {
  console.log(">>> Updating TOTAL AMOUNT.");

});


module.exports = router;




//
