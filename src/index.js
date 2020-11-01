import "dotenv/config";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import getPlaces from "./places";
import calculateJourney from "./journey";
import getItinerary from "./itinerary";

// Set up the express app
const app = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/api/v1/journeys/:id", async (req, res) => {
  const { params } = req;
  const { id } = params;

  res.status(200).send({
    success: "true",
    data: { id },
  });
});

app.post("/api/v1/journeys/", async (req, res) => {
  try {
    //  get params
    const { body } = req;
    const { region, types, dates } = body;

    //  1. get places
    const places = getPlaces(region, dates, types);

    //  2. calculate the best route
    const journey = calculateJourney(places, dates);

    //  3. get directions
    const itinerary = await getItinerary(journey);

    // //  4. do booking
    // const booking = doBooking(itinerary);

    //  5. send confirmation
    const payload = {
      itinerary,
      // booking,
    };

    res.status(200).send({
      success: "true",
      data: payload,
    });
  } catch (err) {
    console.error(err);
    const errorMsg =
      err && err.toString
        ? `${err.stack}:${err.toString()}`
        : "Something broke";
    res.status(500).send(errorMsg);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
