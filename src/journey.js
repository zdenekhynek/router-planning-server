import add from "date-fns/add";
import parse from "date-fns/parse";
import getHours from "date-fns/getHours";
import set from "date-fns/set";

export const parseDuration = (durationString) => {
  //  for now just handles hours
  const hours = parseFloat(durationString);
  return hours;
};

/**
 * Avoid travelling between 8pm and 8am.
 **/
export const enforceTimeWindow = (date, timeWindow = [8, 20]) => {
  let enforcedDate = date;

  //  get time, if not within time window,
  //  push date to the next available opening
  const hours = getHours(date);
  if (hours < timeWindow[0]) {
    //  set date to beginning of the timeWindow same day
    enforcedDate = set(enforcedDate, { hours: timeWindow[0] });
  } else if (hours > timeWindow[1]) {
    //  set date to beginning of the timeWindow next day
    enforcedDate = add(enforcedDate, { days: 1 });
    enforcedDate = set(enforcedDate, { hours: timeWindow[0] });
  }

  return enforcedDate;
};

/**
 * Get approximate distances between everything
 * maybe cached results, calculated from travel feeds
 * or from distance.
 */
export default function calculateJourney(places, dates) {
  const startDate = dates[0];

  //  for now just reshuffle them
  const orderedPlaces = places;

  //  and add times
  let currTime = parse(startDate, "yyyy-MM-dd", new Date());
  const journey = orderedPlaces.reduce((acc, place) => {
    const hourDuration =
      place.time && place.time.duration
        ? parseDuration(place.time.duration)
        : 12;

    place.time.arrival = currTime;

    //  get the soonest possible departure
    currTime = add(currTime, { hours: hourDuration });

    //  enforce departure in time window
    place.time.departure = enforceTimeWindow(currTime);

    acc.push(place);

    //  @TODO - add for travel duration from some interal data
    const travelDuration = 4;
    currTime = add(currTime, { hours: travelDuration });

    return acc;
  }, []);

  //  do whatever repair/travel salesman taking the constraints into account

  return journey;
}

// export const getFetchUrl = (from, to) => {
//   const { TFL_APP_ID, TFL_APP_KEY } = process.env;
//   const BASE_URL = "https://api.tfl.gov.uk/journey/journeyresults/";
//   return `${BASE_URL}/${from}/to/${to}?app_id=${TFL_APP_ID}&app_key=${TFL_APP_KEY}`;
// };

// export const fetchJourney = async (from, to) => {
//   const url = getFetchUrl(from, to);
//   try {
//     const response = await fetch(url);
//     return await response.json();
//   } catch (err) {
//     console.error(`Error fetching data: ${err}`);
//   }
// };

// export const getJourney = async (from, to) => {
//   const json = await fetchJourney(from, to);
//   return parseResults(json);
// };
