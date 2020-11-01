import { fetchGoogleDirections } from "./google/directions.js";

export const getDirections = async (from, to, date) => {
  return fetchGoogleDirections(from, to, date);
};

export default async function getItinerary(journey) {
  //  split journey into trip couples
  const trips = journey.reduce((acc, from, i) => {
    if (i < journey.length - 1) {
      const to = journey[i + 1];
      acc.push({ from, to, date: from.time.departure });
    }
    return acc;
  }, []);

  const fetches = trips.map((trip) => {
    const { from, to, date } = trip;
    return getDirections(from, to, date);
  });

  const results = await Promise.all(fetches);

  return results;
}
