import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import users from "./data/users.json";
import trips from "./data/trips.json";

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());  

// Start defining your routes here
app.get("/", (req, res) => { res.send("hello world"); });

app.get("/users", (req, res) => { 
  res.json(users)
 })

app.get("/trips", (req, res) => { 
  res.json(trips)
})
 
app.get("/trips/:status", (req, res) => { 
  const status = req.params.status; // Extract status from URL params
  const normalizedStatus = status.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase(); // Normalize status for comparison
  const tripStatus = trips.filter((trip) => trip.status.toLowerCase() === normalizedStatus); // Filter trips by normalized status


  if (tripStatus.length > 0) {
    res.json(tripStatus); // Return matching trips
  } else {
    const message = `No trips found for "${status}" trips`; // Custom message with input status
    res.status(404).json({ message });
  }
  
})

// Start the server
app.listen(port, () => console.log("App listening on port ${port}! Yay!"));
