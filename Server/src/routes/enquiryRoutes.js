const express = require("express");
const adminAuth = require("../middleware/adminAuth");
const {
  createEnquiry,
  getAllEnquiries,
  deleteAllEnquiries,
} = require("../controllers/enquiryController");

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", adminAuth, getAllEnquiries);
router.delete("/", adminAuth, deleteAllEnquiries);

module.exports = router;
