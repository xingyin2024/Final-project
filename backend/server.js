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

  // Validate role
  if (role !== 'admin' && role !== 'co-worker') {
    return res.status(403).json({ message: "Invalid role" });
  }

  req.user = { id: userID, role };
  next();
};

// Admin authorization middleware || A reusable middleware to check if the user is an admin. ex "/admin/secure-data"
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// Normalize value function
const normalizeValue = (key, value) => {
  if (key === "status") {
    return handleNormalizeStatus(value);
  }
  return value.toLowerCase();
};

// Status normalization function
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


/***************** router start here ************* */

// Default endpoint
app.get("/", (req, res) => res.send("Welcome to the Traktamente API"));

// All User endpoint (admin only)
app.get("/admin/users", authenticate, authorizeAdmin, (req, res) => {
  res.json(users);
});

// All trips endpoint (admin only)
app.get("/admin/trips", authenticate, authorizeAdmin, (req, res) => {
  res.json(trips);
});

// Unified trips endpoint
app.get("/trips", authenticate, (req, res) => {
  const { userID: queryUserID, ...queryFilters } = req.query; // Separate userID from other filters
  const { id: authenticatedUserID, role } = req.user; // Extract authenticated user details

  // Initialize filtered trips
  let filteredTrips = trips;

  // Apply role-based filtering
  if (role !== "admin") {
    // Regular users can only access their own trips
    if (queryUserID && queryUserID !== authenticatedUserID) {
      return res.status(403).json({ message: "Access denied. You can only view your own trips." });
    }
    filteredTrips = filteredTrips.filter((trip) => trip.userID === authenticatedUserID);
  } else if (queryUserID) {
    // Admin can filter by userID if provided, tex "/trips?userID=123"
    filteredTrips = filteredTrips.filter((trip) => trip.userID === queryUserID);
  }

  // Apply dynamic query filters
  for (const [key, value] of Object.entries(queryFilters)) {
    if (key === "status") {
      // Normalize and validate status
      const normalizedStatus = normalizeValue(key, value);
      const matchingStatuses = validStatusGroups[normalizedStatus];

      if (!matchingStatuses) {
        return res.status(400).json({
          message: `Invalid status: "${value}". Please use one of the following: "${Object.keys(validStatusGroups).join('", "')}"`,
        });
      }

      filteredTrips = filteredTrips.filter((trip) =>
        matchingStatuses.includes(trip.status.toLowerCase())
      );
    } else if (key === "createdBy") {
      // Filter by createdBy
      filteredTrips = filteredTrips.filter(
        (trip) => trip.creation.createdBy.toLowerCase() === value.toLowerCase()
      );
    } else if (key === "approvedBy") {
      // Filter by approvedBy
      filteredTrips = filteredTrips.filter(
        (trip) =>
          trip.submission.approvedBy &&
          trip.submission.approvedBy.toLowerCase() === value.toLowerCase()
      );
    } else {
      // Handle invalid query parameters
      return res.status(400).json({ message: `Invalid query parameter: "${key}"` });
    }
  }

  if (filteredTrips.length > 0) {
    res.json(filteredTrips);
  } else {
    res.status(404).json({ message: "No trips found with the provided filters." });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}! Yay!`));
