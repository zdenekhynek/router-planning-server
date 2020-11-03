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

  //  @TODO - reshuffle places
  const orderedPlaces = places;
  
  //  add first place to the end as a final destination
  if (places.length) {
    orderedPlaces.push(places[0]);
  }

  //  and add times
  let currTime = parse(startDate, "yyyy-MM-dd", new Date());
  const journey = orderedPlaces.reduce((acc, place) => {
    //  deep clone
    const newPlace = JSON.parse(JSON.stringify(place));

    const hourDuration =
      newPlace.time && newPlace.time.duration
        ? parseDuration(newPlace.time.duration)
        : 12;
    newPlace.time.arrival = currTime;

    //  get the soonest possible departure
    currTime = add(currTime, { hours: hourDuration });

    //  enforce departure in time window
    currTime = enforceTimeWindow(currTime);
    newPlace.time.departure = currTime;

    acc.push(newPlace);

    //  @TODO - add for travel duration from some internal data
    const travelDuration = 4;
    currTime = add(currTime, { hours: travelDuration });

    return acc;
  }, []);

  //  do whatever repair/travel salesman taking the constraints into account

  return journey;
}
