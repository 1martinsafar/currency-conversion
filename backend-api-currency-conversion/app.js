// Your app should not require any pre-requisites. It should
// run on any machine with latest LTS version of Node.
// Alternatively you can create a Docker image.

"use strict";

const express = require("express");
const app = express();

const jsonParser = require("body-parser").json;
const fs = require("fs");
const logger = require("morgan");

// Data
const data = fs.readFileSync("stats.json");
const stats = JSON.parse(data);

// Routes
const routes_stats = require("./routes/routes_stats");
const routes_convert = require("./routes/routes_convert");

// Parsing the req body as JSON
// making it accessible from the req.body property
app.use(jsonParser());

// Getting info about requests in the console
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

// The routes will try to apply one of the handlers
app.use("/stats", routes_stats);
app.use("/convert", routes_convert);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Setting the PORT for the API to run on
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening on port:", port);
});





//
