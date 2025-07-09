const express = require("express");
const {
  getAllFlights,
  searchFlights,
  getSingleFlight,
  createFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flight.controller");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// public
router.get("/", getAllFlights);
router.get("/search", searchFlights);
router.get("/:id", getSingleFlight);

// admin only
router.post("/", verifyToken, verifyAdmin, createFlight);
router.put("/:id", verifyToken, verifyAdmin, updateFlight);
router.delete("/:id", verifyToken, verifyAdmin, deleteFlight);

module.exports = router;
