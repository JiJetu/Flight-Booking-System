const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

// middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// send email
const sendEmail = (emailAddress, emailData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.TRANSPORTER_EMAIL,
      pass: process.env.TRANSPORTER_PASSWORD,
    },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  const mailBody = {
    from: `"StayVista" <${process.env.TRANSPORTER_EMAIL}>`, // sender address
    to: emailAddress, // list of receivers
    subject: emailData.subject, // Subject line
    html: emailData.message, // html body
  };

  transporter.sendMail(mailBody, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};

// creating token
const createToken = (jwtPayload, secret, expiresIn) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// verifying token middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};

//mongoDB connection
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // db and db collections
    const database = client.db("flightBookingSystem");
    const usersCollection = database.collection("users");
    const flightsCollection = database.collection("flights");
    const bookingsCollection = database.collection("bookings");

    // verifying admin middleware
    const verifyAdmin = async (req, res, next) => {
      const result = await usersCollection.findOne({ email: req?.user?.email });

      if (!result || result?.role !== "admin")
        return res.status(401).send({ message: "unauthorized access!!" });

      next();
    };

    //!-----------------auth api------------------

    // save a user in db
    app.post("/api/register", async (req, res) => {
      try {
        const user = req.body;
        const query = { email: user?.email };

        const isExist = await usersCollection.findOne(query);
        if (isExist) {
          return res.status(409).send({ message: "User is already exist" });
        }

        const hashed = await bcrypt.hash(
          user?.password,
          Number(process.env.BCRYPT_SALT_ROUNDS)
        );

        user.password = hashed;
        user.timestamp = Date.now();
        user.role = "user";

        //   creating user in db
        const result = await usersCollection.insertOne(user);

        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "failed to crate a user" });
      }
    });

    // find a user from db and added jwt
    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const query = { email };

        const existingUser = await usersCollection.findOne(query);

        if (!existingUser) {
          return res.status(404).send({ message: "Sorry!, User not found" });
        }

        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );
        if (!passwordMatch) {
          return res.status(401).send({ message: "Invalid password" });
        }
        const jwtPayload = {
          userId: existingUser?._id,
          email: existingUser?.email,
          role: existingUser?.role,
        };

        const accessToken = createToken(
          jwtPayload,
          process.env.JWT_ACCESS_SECRET,
          process.env.JWT_ACCESS_EXPIRES_IN
        );

        const refreshToken = createToken(
          jwtPayload,
          process.env.JWT_REFRESH_SECRET,
          process.env.JWT_REFRESH_EXPIRES_IN
        );

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .status(200)
          .send({
            accessToken,
            image: existingUser.image,
            name: existingUser.name,
          });
      } catch (error) {
        res.status(500).send({ message: "failed to fetch a user" });
      }
    });

    // logout
    app.post("/api/logout", async (req, res) => {
      try {
        res
          .clearCookie("refreshToken", {
            maxAge: 0,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          })
          .status(200)
          .send({ success: true });
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // refresh token
    app.post("/api/refresh-token", async (req, res) => {
      try {
        const { refreshToken } = req.cookies;

        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        );
        console.log(decoded);
        const { email } = decoded;

        const isExistUser = await usersCollection.findOne({ email });
        if (!isExistUser) {
          return res.status(404).send({ message: "Sorry!, User not found" });
        }

        const jwtPayload = {
          userId: isExistUser?._id,
          email: isExistUser?.email,
          role: isExistUser?.role,
        };

        const accessToken = createToken(
          jwtPayload,
          process.env.JWT_ACCESS_SECRET,
          process.env.JWT_ACCESS_EXPIRES_IN
        );

        res.status(200).send({ accessToken });
      } catch (error) {
        res.status(500).send({ message: "failed to fetch  refresh token" });
      }
    });

    //!-----------------flight api------------------

    // get all flights from db with
    app.get("/api/flights", async (req, res) => {
      try {
        const { page = 1, limit = 10 } = req.query;

        const filters = {
          availableSeats: { $gt: 0 },
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await flightsCollection.countDocuments(filters);

        const flights = await flightsCollection
          .find(filters)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        res.status(200).send({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          flights,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch flight data" });
      }
    });

    // get all flights by search from db with pagination
    app.get("/api/flights/search", async (req, res) => {
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

        const query = {
          availableSeats: { $gt: 0 },
        };

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
        const total = await flightsCollection.countDocuments(query);

        const flights = await flightsCollection
          .find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();

        res.status(200).send({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          flights,
        });
      } catch (error) {
        res.status(500).send({ message: "Failed to fetch flight data" });
      }
    });

    // get a flight from db
    app.get("/api/flights/:id", async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid flight ID format" });
        }
        const result = await flightsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!result) {
          res.status(404).send({ message: "flight data not found" });
        }

        res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "failed to fetch a single flight data" });
      }
    });

    // create a flight by admin in db
    app.post("/api/flights", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const flight = req.body;

        const result = await flightsCollection.insertOne(flight);

        res.status(201).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "failed to create flight data" });
      }
    });

    // update a flight by admin in db
    app.put("/api/flights/:id", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const flight = req.body;
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        updatedDoc = {
          $set: { ...flight },
        };
        const options = { upsert: true };

        const result = await flightsCollection.updateOne(
          query,
          updatedDoc,
          options
        );

        res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "failed to update flight data" });
      }
    });

    // delete a flight by admin in db
    app.delete(
      "/api/flights/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result = await flightsCollection.deleteOne({
            _id: new ObjectId(id),
          });

          res.status(200).send(result);
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: "failed to delete flight data" });
        }
      }
    );

    //!-----------------booking api------------------

    // get all bookings from db with pagination
    app.get("/api/bookings", verifyToken, verifyAdmin, async (req, res) => {
      try {
        const { page = 1, limit = 10 } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const pipeline = [
          {
            $addFields: {
              flightObjId: { $toObjectId: "$flightId" },
              userObjId: { $toObjectId: "$user.userId" },
            },
          },
          {
            $lookup: {
              from: "flights",
              localField: "flightObjId",
              foreignField: "_id",
              as: "flightDetails",
            },
          },
          { $unwind: "$flightDetails" },
          {
            $lookup: {
              from: "users",
              localField: "userObjId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          { $unwind: "$userDetails" },
          { $skip: skip },
          { $limit: parseInt(limit) },
        ];

        const bookings = await bookingsCollection.aggregate(pipeline).toArray();
        const total = await bookingsCollection.countDocuments();

        res.send({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          bookings,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to fetch bookings" });
      }
    });

    // get user specific bookings from db with pagination
    app.get("/api/bookings/user/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (req.user?.userId !== id) {
          return res.status(403).json({ message: "Forbidden access" });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const pipeline = [
          { $match: { "user.userId": id } },
          {
            $addFields: {
              flightObjId: {
                $convert: {
                  input: "$flightId",
                  to: "objectId",
                  onError: null,
                },
              },
            },
          },
          {
            $lookup: {
              from: "flights",
              localField: "flightObjId",
              foreignField: "_id",
              as: "flightDetails",
            },
          },
          {
            $unwind: {
              path: "$flightDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              flightId: 1,
              user: 1,
              numberOfSeats: 1,
              totalPrice: 1,
              status: 1,
              timestamp: 1,
              "flightDetails.airline": 1,
              "flightDetails.flightNumber": 1,
              "flightDetails.origin": 1,
              "flightDetails.destination": 1,
              "flightDetails.departureTime": 1,
              "flightDetails.arrivalTime": 1,
              "flightDetails.image": 1,
            },
          },
          { $skip: skip },
          { $limit: parseInt(limit) },
        ];

        const total = await bookingsCollection.countDocuments({
          "user.userId": id,
        });

        const bookings = await bookingsCollection.aggregate(pipeline).toArray();

        res.status(200).json({
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          bookings,
        });
      } catch (error) {
        console.error("Failed to fetch user bookings:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // create user booking into db
    app.post("/api/bookings", verifyToken, async (req, res) => {
      try {
        const booking = req.body;
        const reqUser = req?.user;
        booking.status = "Pending";
        booking.timestamp = Date.now();

        const { flightId, user } = booking;

        const isFlightExist = await flightsCollection.findOne({
          _id: new ObjectId(flightId),
        });

        if (!isFlightExist) {
          return res.status(404).send({ message: "Sorry!, flight not found" });
        }

        const isUserExist = await usersCollection.findOne({
          _id: new ObjectId(user?.userId),
        });

        if (!isUserExist) {
          return res.status(404).send({ message: "Sorry!, user not found" });
        }

        if (isUserExist?.role !== reqUser?.role) {
          return res.status(403).send({ message: "forbidden access!!" });
        }

        const result = await bookingsCollection.insertOne(booking);

        const availableSeats =
          parseInt(isFlightExist.availableSeats) -
          parseInt(booking.numberOfSeats);

        await flightsCollection.updateOne(
          {
            _id: new ObjectId(flightId),
          },
          {
            $set: { availableSeats },
          }
        );

        sendEmail(isUserExist?.email, {
          subject: "Booking Successful!",
          message: `You've successfully booked a flight through ✈Flights. Please wait for admin confirmation`,
        });

        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "failed to create booking data" });
      }
    });

    // update user bookings by admin in db and user can update with in 2hour
    app.put("/api/bookings/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const { status: bookingStatus } = req.body;
        const reqUser = req.user;

        const booking = await bookingsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!booking) {
          return res.status(404).send({ message: "Booking not found" });
        }

        const flight = await flightsCollection.findOne({
          _id: new ObjectId(booking.flightId),
        });

        if (!flight) {
          return res
            .status(404)
            .send({ message: "Associated flight not found" });
        }

        const userData = await usersCollection.findOne({
          _id: new ObjectId(booking.user.userId),
        });

        if (!userData) {
          return res.status(404).send({ message: "User info not found" });
        }

        const isAdmin = reqUser.role === "admin";
        const isUserMatch = booking.user.userId === reqUser.userId;

        // admin approval
        if (isAdmin) {
          await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: bookingStatus, timestamp: Date.now() } }
          );

          if (bookingStatus === "Cancel") {
            await flightsCollection.updateOne(
              { _id: new ObjectId(booking.flightId) },
              {
                $inc: {
                  availableSeats: parseInt(booking.numberOfSeats),
                },
              }
            );
          }

          const message =
            bookingStatus === "Confirm"
              ? `Dear ${
                  userData.name || "User"
                },\n\nYour booking request (ID: ${
                  booking._id
                }) has been *approved* by the admin.\n\nThank you for using ✈Flights.`
              : `Dear ${userData.name || "User"},\n\nYour booking (ID: ${
                  booking._id
                }) has been *cancelled* by the admin.\n\nWe apologize for the inconvenience.`;

          sendEmail(userData.email, {
            subject: `Booking ${bookingStatus} Notification`,
            message,
          });

          return res.status(200).send({
            message: `Booking ${bookingStatus.toLowerCase()}ed by admin`,
          });
        }

        // if user cancel within 2 hours
        if (
          bookingStatus === "Cancel" &&
          isUserMatch &&
          booking.status === "Pending"
        ) {
          const bookingTime = new Date(booking.timestamp);
          const twoHoursPassed =
            Date.now() - bookingTime.getTime() > 2 * 60 * 60 * 1000;

          if (!twoHoursPassed) {
            await bookingsCollection.updateOne(
              { _id: new ObjectId(id) },
              { $set: { status: "Cancel", timestamp: Date.now() } }
            );

            await flightsCollection.updateOne(
              { _id: new ObjectId(booking.flightId) },
              {
                $inc: {
                  availableSeats: parseInt(booking.numberOfSeats),
                },
              }
            );

            // email to user
            sendEmail(userData.email, {
              subject: "Booking Cancelled",
              message: `Your booking (ID: ${booking._id}) has been successfully cancelled.`,
            });

            // email to admin
            sendEmail("admin@example.com", {
              subject: "Booking Cancelled by User",
              message: `Booking (ID: ${booking._id}) was cancelled by the user (${userData.email}).`,
            });

            return res
              .status(200)
              .send({ message: "Booking cancelled by user" });
          } else {
            return res.status(400).send({
              message: "You can only cancel within 2 hours of booking time",
            });
          }
        }

        return res
          .status(403)
          .send({ message: "Unauthorized to update booking" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update booking data" });
      }
    });

    // delete user bookings by admin in db
    app.delete(
      "/api/bookings/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        try {
          const { id } = req.params;

          const result = await bookingsCollection.deleteOne({
            _id: new ObjectId(id),
          });

          res.status(200).send(result);
        } catch (error) {
          res
            .status(500)
            .send({ message: "failed to delete specific booking data" });
        }
      }
    );

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Flight Booking System server is running...");
});

app.listen(port, () => {
  console.log(`Server is running om port: ${port}`);
});
