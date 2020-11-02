import { fetchGoogleDirections } from "./google/directions.js";

export const getDirections = async (from, to, date) => {
  return fetchGoogleDirections(from, to, date);
};

export default async function getItinerary(journey) {
  //  split journey into trip couples
  const trips = journey.reduce((acc, from, i) => {
    if (i < journey.length - 1) {
      const to = journey[i + 1];
      acc.push({ from, to, date: from.time.departure, stay: to.time.duration });
    }
    return acc;
  }, []);

  const fetches = trips.map((trip) => {
    const { from, to, date, stay } = trip;
    return getDirections(from, to, date);
  });

  const results = await Promise.all(fetches);

  //  amend results with stays
  const amendedResults = results.map((result, i) => {
    const { stay } = trips[i];
    if (result.length) {
      result[0] = { stay, ...result[0] };
    }
    return result;
  });

  return amendedResults;
}
