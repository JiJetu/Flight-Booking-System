const Flight = require("../models/Flight.model");

// Create Flight (admin only)
exports.createFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const result = await flight.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to create flight" });
  }
};

// Get All Flights with Pagination
exports.getAllFlights = async (req, res) => {
  try {
    const { page = 1, limit = 10, availableFlights = true } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (availableFlights) query = { availableSeats: { $gt: 0 } };

    const total = await Flight.countDocuments(query);
    const flights = await Flight.find(query).skip(skip).limit(Number(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      flights,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flights" });
  }
};

// Search Flights
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      airline,
      minPrice,
      maxPrice,
      minSeats,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { availableSeats: { $gt: 0 } };

    if (origin) query.origin = origin;
    if (destination) query.destination = destination;
    if (date) query.departureTime = { $regex: `^${date}` };
    if (airline) query.airline = airline;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minSeats) {
      query.availableSeats.$gte = Number(minSeats);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Flight.countDocuments(query);
    const flights = await Flight.find(query).skip(skip).limit(Number(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      flights,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to search flights" });
  }
};

// Get Single Flight
exports.getSingleFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const flight = await Flight.findById(id);
    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }
    res.status(200).json(flight);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch flight" });
  }
};

// Update Flight (admin only)
exports.updateFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Flight.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update flight" });
  }
};

// Delete Flight (admin only)
exports.deleteFlight = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Flight.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete flight" });
  }
};
