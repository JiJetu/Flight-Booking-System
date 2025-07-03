const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
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

// creating token
const createToken = (jwtPayload, secret, expiresIn) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// verifying token
const verifyToken = async (req, res, next) => {
  const token = req.headers?.authorization;
  console.log(token);
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
    const database = client.db("flightBookingSystem");
    const usersCollection = database.collection("user");

    // auth related api

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
          .status(201)
          .send(result, { accessToken });
      } catch (error) {
        res.status(500).send({ message: "failed to fetch a user" });
      }
    });

    // refresh token
    app.post("/refresh-token", async (req, res) => {
      try {
        const { refreshToken } = req.cookies;

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const { email } = decoded;
        const query = { email };

        const isExistUser = await usersCollection.findOne(query);
        if (!isExistUser) {
          return res.status(404).send({ message: "Sorry!, User not found" });
        }

        const jwtPayload = {
          email: isExistUser?.email,
          role: isExistUser?.role,
        };

        const accessToken = createToken(
          jwtPayload,
          process.env.JWT_ACCESS_SECRET,
          process.env.JWT_ACCESS_EXPIRES_IN
        );

        res.status(201).send({ accessToken });
      } catch (error) {
        res.status(500).send({ message: "failed to fetch  refresh token" });
      }
    });

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
