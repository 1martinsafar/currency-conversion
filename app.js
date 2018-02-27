// set up CORS later
//
//
// In the backend, use an external API
// to get the currency rates.
//
//
// The frontend has to communicate
// only with your custom API.
//
//
// Currency rates APIs:
// => https://openexchangerates.org
// => https://currencylayer.com
// => http://fixer.io
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
// LATER: return multiple popular destinations if they're equal

"use strict";

const express = require("express");
const app = express();

const jsonParser = require("body-parser").json;
const fs = require("fs");
const logger = require("morgan");

const routes = require("./routes");
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);

// parsing the req body as JSON
// making it accessible from the req.body property
app.use(jsonParser());

app.use(logger("dev"));

// the routes module will try to apply one of the handlers
app.use("/stats", routes);

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
