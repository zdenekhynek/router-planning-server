const cachedFetch = require("node-fetch-cache")("./.cache");
import format from "date-fns/format";
import tempData from "../fixtures/directions/craignure-loch_awe.json";

export const parseStep = (step) => {
  const distance = step.distance ? step.distance.text : "N/A";
  const duration = step.duration ? step.duration.text : "N/A";
  const instructions = step.html_instructions ? step.html_instructions : "";
  const polyline = step.polyline ? step.polyline : {};

  //  @TODO - deal with nested steps

  return {
    distance,
    duration,
    instructions,
    polyline,
  };
};

export const parseLeg = (leg, date) => {
  if (!leg) {
    return {};
  }

  const start = { address: leg.start_address, location: leg.start_location };
  const end = { address: leg.end_address, location: leg.end_location };
  const arrival = leg.arrival_time ? leg.arrival_time.text : "N/A";
  const departure = leg.departure_time ? leg.departure_time.text : "N/A";
  const distance = leg.distance ? leg.distance.text : "N/A";
  const duration = leg.duration ? leg.duration.text : "N/A";
  const steps = leg.steps ? leg.steps.map(parseStep) : [];

  const formattedDate = format(date, "do MMMM");

  return {
    date: formattedDate,
    start,
    end,
    arrival,
    departure,
    distance,
    duration,
    steps,
  };
};

export const parseGoogleResponse = (data = tempData, date) => {
  if (data && data.routes && data.routes.length) {
    const route = data.routes[0];
    const legs = route.legs.map((leg) => parseLeg(leg, date));
    return legs;
  }

  //  some sort of error
  return [];
};

export const getGoogleDirectionsUrl = (from, to, date) => {
  const { GOOGLE_API_KEY } = process.env;

  const baseUrl = "https://maps.googleapis.com/maps/api";
  const endpoint = "directions";
  const format = "json";
  const url = `${baseUrl}/${endpoint}/${format}`;

  const mode = "transit";
  const key = GOOGLE_API_KEY;
  const origin = from.address;
  const destination = to.address;
  const departureTime = date.getTime() / 1000; // convert ms to s

  const queryParams = `mode=${mode}&origin=${origin}&destination=${destination}&departure_time=${departureTime}&key=${key}`;
  return `${url}?${queryParams}`;
};

export const fetchGoogleDirections = async (from, to, date) => {
  const url = getGoogleDirectionsUrl(from, to, date);

  try {
    const response = await cachedFetch(url);
    const json = await response.json();
    return parseGoogleResponse(json, date);
  } catch (err) {
    console.log("url", url);
    console.error(`Error fetching data: ${err}`);
  }
};
