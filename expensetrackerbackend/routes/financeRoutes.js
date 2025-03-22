const express = require("express");
const router = express.Router();
const Finance = require("../models/Finance");

// ➤ Add Finance Data
router.post("/add", async (req, res) => {
  try {
    const newFinance = new Finance(req.body);
    await newFinance.save();
    res.status(201).json({ message: "Finance data added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get All Finance Data
router.get("/all", async (req, res) => {
  try {
    const data = await Finance.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update Finance Data by ID
router.put("/update/:id", async (req, res) => {
  try {
    const updatedFinance = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFinance) {
      return res.status(404).json({ message: "Finance record not found!" });
    }
    res.status(200).json({ message: "Finance data updated successfully!", updatedFinance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete Finance Data by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedFinance = await Finance.findByIdAndDelete(req.params.id);
    if (!deletedFinance) {
      return res.status(404).json({ message: "Finance record not found!" });
    }
    res.status(200).json({ message: "Finance data deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
