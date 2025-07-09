const Booking = require("../models/Booking.model");
const Flight = require("../models/Flight.model");
const User = require("../models/User.model");
const { sendEmail } = require("../utils/sendEmail");
const mongoose = require("mongoose");

// Create Booking (user only)
exports.createBooking = async (req, res) => {
  try {
    const booking = req.body;
    booking.status = "Pending";
    booking.timestamp = Date.now();

    const flight = await Flight.findById(booking.flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    const user = await User.findById(booking.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Deduct seats
    flight.availableSeats -= booking.numberOfSeats;
    await flight.save();

    const result = await Booking.create(booking);

    // Send Email
    sendEmail(user.email, {
      subject: "Booking Successful!",
      message: `You've successfully booked a flight through ✈Flights. Please wait for admin confirmation.`,
    });

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// Get All Bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find()
      .populate("flightId")
      .populate("user.userId")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments();

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      bookings,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get User's Own Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (req.user.userId !== id)
      return res.status(403).json({ message: "Forbidden access" });

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const userObjectId = new mongoose.Types.ObjectId(id);

    const bookings = await Booking.find({
      "user.userId": userObjectId,
    })
      .populate("flightId")
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Booking.countDocuments({
      "user.userId": userObjectId,
    });

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      bookings,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// Update Booking (admin or user cancellation within 2 hours)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id);
    const booking = await Booking.findById(id);
    const user = await User.findById(booking.user.userId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isAdmin = req.user.role === "admin";
    const isUserMatch = String(req.user.userId) === String(booking.user.userId);

    const twoHoursPassed =
      Date.now() - new Date(booking.timestamp).getTime() > 2 * 60 * 60 * 1000;

    // Admin: confirm or cancel
    if (isAdmin) {
      await Booking.findByIdAndUpdate(id, {
        status,
        timestamp: Date.now(),
      });

      if (status === "Cancel") {
        await Flight.findByIdAndUpdate(booking.flightId, {
          $inc: { availableSeats: booking.numberOfSeats },
        });
      }

      sendEmail(user.email, {
        subject: `Booking ${status}`,
        message:
          status === "Confirm"
            ? `Your booking (${id}) has been confirmed by admin.`
            : `Your booking (${id}) has been cancelled by admin.`,
      });

      return res.status(200).json({ message: `Booking ${status}ed by admin` });
    }

    // User: cancel if not confirmed and within 2 hours
    if (
      status === "Cancel" &&
      isUserMatch &&
      booking.status === "Pending" &&
      !twoHoursPassed
    ) {
      await Booking.findByIdAndUpdate(id, {
        status: "Cancel",
        timestamp: Date.now(),
      });

      await Flight.findByIdAndUpdate(booking.flightId, {
        $inc: { availableSeats: booking.numberOfSeats },
      });

      sendEmail(user.email, {
        subject: "Booking Cancelled",
        message: `Your booking (${id}) has been cancelled.`,
      });

      sendEmail("admin@example.com", {
        subject: "Booking Cancelled by User",
        message: `User ${user.email} cancelled booking (${id}).`,
      });

      return res.status(200).json({ message: "Booking cancelled by user" });
    }

    res.status(403).json({ message: "Unauthorized to update booking" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking" });
  }
};

// Delete Booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
