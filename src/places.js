import allPlaces from "./fixtures/places.json";

export const isPlaceOfType = (place, types) => {
  const typeIntersect = place.types.filter((t) => types.includes(t));
  return typeIntersect.length > 0;
};

export const isPlaceInRegion = (place, region) => {
  return place.region === region;
};

export default function getPlaces(region, dates, types) {
  //  filter on region and type
  const suggestedPlaces = allPlaces.filter((place) => {
    const isInRegion = isPlaceInRegion(place, region);
    const isOfType = types.length ? isPlaceOfType(place, types) : true;
    return isInRegion && isOfType;
  });

  //  get accomodation
  const availablePlaces = suggestedPlaces;

  return availablePlaces;
}
