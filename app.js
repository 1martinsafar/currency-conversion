//
//
// In the backend, use an external API
// to get the currency rates.
//
//
// Currency rates APIs:
// => https://openexchangerates.org
// => https://currencylayer.com
// => http://fixer.io
//
//
// The frontend has to communicate
// only with your custom API.
//
//
// The app should also display the following stats:
// 1. Most popular destination currency
// 2. Total amount converted (in USD)
// 3. Total number of conversion requests made
//
//
// Make sure the stats are not cleared on restart and are
// aggregate for all visitors. This means they have to be
// calculated and stored in the backend.
//
//
// Do not use locally installed database. You can use local
// file, free version of some cloud database or any other
// method.
//
//
// Your app should not require any pre-requisites. It should
// run on any machine with latest LTS version of Node.
// Alternatively you can create a Docker image.
//
//
// set up CORS later
//
//
// LATER: maybe return multiple popular destinations if they're equal?

"use strict";

const express = require("express");
const app = express();

const jsonParser = require("body-parser").json;
const fs = require("fs");
const logger = require("morgan");

const routes_stats = require("./routes/routes_stats");
const routes_convert = require("./routes/routes_convert");
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);

// parsing the req body as JSON
// making it accessible from the req.body property
app.use(jsonParser());

app.use(logger("dev"));

// Allowing Cross-Origin Resource Sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return res.status(200).json({});
  }
  next();
});

// the routes module will try to apply one of the handlers
app.use("/stats", routes_stats);
// the routes module will try to apply one of the handlers
app.use("/convert", routes_convert);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening on port:", port);
});





//
