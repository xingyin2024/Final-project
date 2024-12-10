import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import users from "./data/users.json";
import trips from "./data/trips.json";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Simplified authentication middleware
const authenticate = (req, res, next) => {
  const userID = req.headers['userid'] || req.headers['userID'];
  const role = req.headers['role'];

  if (!userID || !role) {
    return res.status(401).json({ message: "Authentication required" });
  }

   // Check if the role is valid
  if (role !== 'admin' && role !== 'co-worker') {
    return res.status(403).json({ message: "Invalid role" });
  }

  req.user = { id: userID, role };
  next();
};

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Normalization function for status
const handleNormalizeStatus = (status) => {
  return status
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .toLowerCase();
};

// Valid status groups
const validStatusGroups = {
  "not submitted": ["not submitted"],
  "submitted": ["approved", "awaiting approval"],
  "approved": ["approved"],
  "awaiting approval": ["awaiting approval"],
};

// Default endpoint
app.get("/", (req, res) => res.send("Welcome to the Traktamente API"));

// User endpoint (admin only)
app.get("/users", authenticate, authorizeAdmin, (req, res) => {
  res.json(users);
});

// All trips endpoint (admin only)
app.get("/admin/trips", authenticate, authorizeAdmin, (req, res) => {
  res.json(trips);
});

// Endpoint to get all trips for a specific user
app.get("/users/:userID/trips", authenticate, (req, res) => {
  const userID = req.params.userID;
  
  if (req.user.role !== "admin" && req.user.id !== userID) {
    return res.status(403).json({ message: "Access denied. You can only view your own trips." });
  }

  const userTrips = trips.filter((trip) => trip.userID === userID);

  if (userTrips.length > 0) {
    res.json(userTrips);
  } else {
    res.status(404).json({ message: `No trips found for user "${userID}".` });
  }
});

// Endpoint to get trips for a specific user filtered by status
app.get("/users/:userID/trips/:status", authenticate, (req, res) => {
  const { userID, status } = req.params;
  
  if (req.user.role !== "admin" && req.user.id !== userID) {
    return res.status(403).json({ message: "Access denied. You can only view your own trips." });
  }

  const normalizedStatus = handleNormalizeStatus(status);
  console.log(`Normalized status: ${normalizedStatus}`);

  const matchingStatuses = validStatusGroups[normalizedStatus];
  console.log(`Matching statuses:`, matchingStatuses); 

  if (!matchingStatuses) {
    return res.status(400).json({
      message: `Invalid status: "${status}". Please use one of the following: "${Object.keys(validStatusGroups).join('", "')}"`,
    });
  }

  const filteredTrips = trips.filter((trip) => 
    trip.userID === userID && matchingStatuses.includes(trip.status.toLowerCase())
  );

  if (filteredTrips.length > 0) {
    res.json(filteredTrips);
  } else {
    res.status(404).json({ message: `No trips found for user "${userID}" with status "${status}"` });
  }
});

// Admin endpoint to get all trips filtered by status
app.get("/admin/trips/:status", authenticate, authorizeAdmin, (req, res) => {
  const { status } = req.params;
  const normalizedStatus = handleNormalizeStatus(status);
  const matchingStatuses = validStatusGroups[normalizedStatus];

  if (!matchingStatuses) {
    return res.status(400).json({
      message: `Invalid status: "${status}". Please use one of the following: "${Object.keys(validStatusGroups).join('", "')}"`,
    });
  }

  const filteredTrips = trips.filter((trip) => matchingStatuses.includes(trip.status.toLowerCase()));

  if (filteredTrips.length > 0) {
    res.json(filteredTrips);
  } else {
    res.status(404).json({ message: `No trips found with status "${status}"` });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}! Yay!`));



/* This updated server.js includes the following key features:

  A simplified authentication middleware that checks for user ID and role in the request headers.

  An admin authorization middleware to restrict certain endpoints to admin users only.

  Separate endpoints for regular users and admins:
    /users/:userID/trips for users to view all their trips
    /users/:userID/trips/:status for users to filter their trips by status
    /admin/trips for admins to view all trips
    /admin/trips/:status for admins to filter all trips by status

  Proper error handling and status code responses for various scenarios.

  Reusable functions for status normalization and validation. */