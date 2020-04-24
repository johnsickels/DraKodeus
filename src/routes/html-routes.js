const path = require("path");
const express = require("express");
const router = express.Router();

// A default, catch-all route that leads to home.html which displays the home page.
router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

module.exports = router;
