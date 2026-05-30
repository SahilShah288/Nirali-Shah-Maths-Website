const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  getAllSlots,
  bookSlot,
  createSlot,
  deleteSlot,
  updateSlot,
} = require("../controllers/slotController");

const router = express.Router();

router.get("/", getAllSlots);
router.post("/book", bookSlot);

router.post("/admin", adminAuth, createSlot);
router.delete("/:id", adminAuth, deleteSlot);
router.patch("/:id", adminAuth, updateSlot);

module.exports = router;
