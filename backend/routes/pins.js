const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    console.log("pins aa gai data base se");
    res.status(200).json(pins);
    return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

module.exports = router;