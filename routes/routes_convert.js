// a module to handle the routes for calculating conversions
"use strict";

const express = require("express");
const router = express.Router();

/*
SAMPLE EXTERNAL API RESPONSE

http://api.fixer.io/latest?base=USD&symbols=GBP
{
base: "USD",
date: "2018-02-27",
rates: { GBP: 0.71864 }
}
*/

// Using EXTERNAL API for the Conversion Rates
// GET
router.get("/")

module.exports = router;




//
