const express = require("express");
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
} = require("../controllers/booking.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// user
router.post("/", verifyToken, createBooking);
router.get("/user/:id", verifyToken, getUserBookings);

// admin and user(can edit with in 2hr)
router.put("/:id", verifyToken, updateBooking);

// admin only
router.get("/", verifyToken, verifyAdmin, getAllBookings);
router.delete("/:id", verifyToken, verifyAdmin, deleteBooking);

module.exports = router;
